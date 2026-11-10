"""Anonymised architecture diagrams for the six case studies.

Run with the diagramas skill venv:
    ~/.claude/skills/diagramas/assets/venv/bin/python docs/diagrams/render.py
Writes public/diagrams/<slug>.png. Labels come only from the public case write-ups:
no client names, hostnames, IPs or internal service names.
"""

from pathlib import Path

from diagrams import Cluster, Diagram, Edge
from diagrams.aws.compute import EC2, Lambda
from diagrams.aws.cost import CostExplorer
from diagrams.aws.integration import SQS, Eventbridge
from diagrams.aws.ml import Bedrock, Transcribe
from diagrams.aws.network import ALB, APIGateway
from diagrams.aws.storage import S3
from diagrams.generic.device import Mobile
from diagrams.generic.storage import Storage
from diagrams.onprem.client import User, Users
from diagrams.onprem.compute import Server
from diagrams.onprem.database import Postgresql
from diagrams.onprem.inmemory import Redis
from diagrams.programming.framework import Nextjs
from diagrams.saas.chat import Telegram

OUT = Path(__file__).resolve().parents[2] / "public" / "diagrams"
OUT.mkdir(parents=True, exist_ok=True)

ACCENT = "#2b59ff"
GRAPH = {"fontsize": "16", "bgcolor": "transparent", "pad": "0.3", "nodesep": "0.55", "ranksep": "0.8", "dpi": "180", "splines": "spline"}
NODE = {"fontsize": "13", "fontname": "Helvetica"}
EDGE = {"color": "#6b6f78"}
CLUSTER = {"bgcolor": "#e9ebef", "pencolor": "#d5d8de", "fontname": "Helvetica-Bold", "fontsize": "13", "labeljust": "l"}


def diagram(slug: str):
    return Diagram(
        "",
        filename=str(OUT / slug),
        show=False,
        direction="LR",
        outformat="png",
        graph_attr=GRAPH,
        node_attr=NODE,
        edge_attr=EDGE,
    )


def async_edge(label: str = "") -> Edge:
    return Edge(label=label, style="dashed", color=ACCENT, fontcolor=ACCENT, fontsize="11")


def llm_agent() -> None:
    with diagram("llm-agent-tool-calling"):
        chat = Telegram("Messaging\nchannels")
        with Cluster("Serverless layer (AWS)", graph_attr=CLUSTER):
            gateway = APIGateway("API Gateway")
            ingest = Lambda("Ingest +\nfast ack")
            queue = SQS("SQS FIFO")
            runtime = Lambda("Agent\nruntime")
            agent = Bedrock("Bedrock\nAgent")
            tools = Lambda("Action group\n4 tools")
        backend = Server("Product\nbackend")
        chat >> gateway >> ingest >> async_edge("ordered") >> queue >> runtime >> agent >> tools
        tools >> Edge(label="HMAC-signed", fontsize="11") >> backend


def speech_to_text() -> None:
    with diagram("speech-to-text-cost-model"):
        audio = User("Recorded\nconversation")
        with Cluster("Today, in production", graph_attr=CLUSTER):
            asr = Transcribe("Transcription\n80-99.9% of cost")
            llm = Bedrock("LLM writes\nthe note")
        note = Storage("Structured\nnote")
        with Cluster("Proposed: migrate transcription only", graph_attr=CLUSTER):
            phase0 = CostExplorer("Phase 0: measure\nvolume, duration")
            low = Server("Open-weight API\nunder a DPA")
            high = EC2("faster-whisper\non EC2 g6")
        audio >> asr >> llm >> note
        asr >> async_edge("after measuring") >> phase0
        phase0 >> Edge(label="< ~200/day", fontsize="11") >> low
        phase0 >> Edge(label="> ~200/day", fontsize="11") >> high


def event_driven() -> None:
    with diagram("event-driven-integration"):
        sender = Server("Sending\nsystem")
        with Cluster("Ingress", graph_attr=CLUSTER):
            alb = ALB("Internal ALB\nmTLS + CRL")
            ack = Lambda("Validate +\ndurable ack")
        queue = SQS("SQS FIFO\n+ DLQ")
        with Cluster("Processing", graph_attr=CLUSTER):
            transform = Lambda("Format\ntranslation")
            store = Storage("Managed\ndata store")
            bus = Eventbridge("EventBridge\n(reference only)")
        audit = S3("Immutable audit\nS3 Object Lock\n+ hash chain")
        consumers = Users("Consumers")
        sender >> alb >> ack >> async_edge("queued") >> queue >> transform >> store
        transform >> bus >> consumers
        transform >> Edge(style="dotted", color="#9aa0aa", label="every step", fontsize="11") >> audit


def document_ai() -> None:
    with diagram("document-ai-human-in-the-loop"):
        intake = Users("3 intake\nchannels")
        with Cluster("Wave 1A: no AI, permanent fallback", graph_attr=CLUSTER):
            case = Storage("Case file")
            deadlines = Server("Deadlines,\nalerts, agenda")
        with Cluster("Wave 1B: reading at volume", graph_attr=CLUSTER):
            ocr = Server("OCR cascade")
            classify = Server("Classify +\nextract")
            review = User("Human\nconfirmation")
        with Cluster("Wave 1C: grounding", graph_attr=CLUSTER):
            engine = Server("Deadline\nengine")
            corpus = Storage("Cited legal\ncorpus")
        intake >> case >> deadlines
        deadlines >> Edge(style="invis") >> ocr
        ocr >> classify >> review
        review >> async_edge("confirmed proposal") >> case
        deadlines >> Edge(label="later: computed", style="dotted", color="#9aa0aa", fontsize="11") >> engine
        engine >> corpus


def nextjs_app() -> None:
    with diagram("nextjs-security-and-prod-bug"):
        browser = User("Browser")
        with Cluster("Web app (Oracle Cloud)", graph_attr=CLUSTER):
            app = Nextjs("Next.js app\nCSP + rate limits")
            auth = Postgresql("Auth, lockout,\nappend-only audit")
            cache = Redis("Token\ncache")
        middleware = Server("Integration\nmiddleware")
        record = Storage("Legacy system\nof record")
        browser >> app
        app >> [auth, cache]
        app >> Edge(label="read only, nothing stored", fontsize="11") >> middleware >> record


def factotum() -> None:
    with diagram("factotum"):
        phone = Mobile("Phone PWA\nweb push")
        with Cluster("Your own host (private mesh, TLS)", graph_attr=CLUSTER):
            core = Server("Small core")
            modules = Server("Modules\n(sessions, push, ...)")
            cli = Server("Claude Code CLI\nheadless")
            log = Storage("Append-only\nsession log")
        phone >> Edge(label="launch, follow,\napprove", fontsize="11") >> core
        core >> modules >> cli >> log
        modules >> Edge(label="push", style="dashed", color=ACCENT, fontcolor=ACCENT, fontsize="11", constraint="false") >> phone


if __name__ == "__main__":
    for build in (llm_agent, speech_to_text, event_driven, document_ai, nextjs_app, factotum):
        build()
    print("ok", sorted(p.name for p in OUT.glob("*.png")))
