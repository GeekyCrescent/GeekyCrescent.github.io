import pandas as pd
import matplotlib.pyplot as plt
from datetime import datetime, timedelta
import numpy as np
from sklearn.metrics import accuracy_score
df = pd.read_csv("carpetasFGJ_acumulado_2024_09 (1).csv").dropna()
df["fecha_hecho"] = pd.to_datetime(df["fecha_hecho"])
df = df[df['fecha_hecho'].dt.year == 2024]
df = df.sort_values("fecha_hecho")
print(df.head())

# Agrupar por fecha para contar los delitos diarios
df_real_diario = df.groupby("fecha_hecho").size().reset_index(name="Total_Delitos")


# Cargar predicciones anteriores (supongamos que están en una variable llamada `predicciones_180_dias`)
# predicciones_180_dias es un diccionario donde las claves son las alcaldías y los valores son listas de predicciones por día
predicciones_180_dias = pd.read_csv("prediccion_180_dias.csv")
# Crear rango de fechas
fecha_inicio = datetime(2024, 1, 1)
fechas_prediccion = [fecha_inicio + timedelta(days=i) for i in range(180)]

# Crear un DataFrame con las predicciones y las fechas
predicciones_df = pd.DataFrame({
    "Fecha": fechas_prediccion
})

# Añadir columnas para cada alcaldía con las predicciones
for alcaldia, predicciones in predicciones_180_dias.items():
    predicciones_df[alcaldia] = predicciones
    

# Convertir la columna 'Fecha' a formato datetime
predicciones_df['Fecha'] = pd.to_datetime(predicciones_df['Fecha'])

# Calcular el número total de delitos por día (sumando todas las alcaldías)
predicciones_df['Total_Delitos'] = predicciones_df.iloc[:, 1:].sum(axis=1)

prediccion_df = pd.read_csv("predicciones_delitos_180_dias.csv")
n_dias = 180
fechas_base = pd.date_range(start="2024-01-01", periods=n_dias, freq='D')

# Usa np.tile para repetir la secuencia de fechas hasta cubrir el tamaño de 'df'
fechas_repetidas = np.tile(fechas_base, (len(prediccion_df) // n_dias) + 1)

# Ajusta el tamaño de 'fechas_repetidas' para que coincida con el de 'df'
fechas_repetidas = fechas_repetidas[:len(prediccion_df)]

# Asigna la secuencia de fechas repetida a la columna 'fecha' en el DataFrame
prediccion_df['Fecha'] = fechas_repetidas
# Asegúrate de que la columna "Fecha" esté en formato datetime
prediccion_df["Fecha"] = pd.to_datetime(prediccion_df["Fecha"])
prediccion_df.to_csv("¨Predicciones_finales.csv", index =False)

# Agrupa por "Fecha" y suma los delitos de todas las alcaldías para obtener el total diario
df_pred = prediccion_df.groupby("Fecha")["Predicción de Delitos"].sum().reset_index()



plt.figure(figsize=(12, 6))

# Gráfico de delitos reales
plt.plot(predicciones_df['Fecha'], predicciones_df['Total_Delitos'], color='red', label = "Predicción", linestyle='-', marker='o')

# Gráfico de predicciones
plt.plot(df_real_diario["fecha_hecho"], df_real_diario["Total_Delitos"], label="Datos", color="blue", linestyle="--")
#Otra predicción
plt.plot(df_pred["Fecha"],df_pred["Predicción de Delitos"], color = "green", label = "Predicción", linestyle = "-", marker = 0)

# Personalización del gráfico
plt.title("Comparación de Delitos Reales y Predichos por Día")
plt.xlabel("Fecha")
plt.ylabel("Número de Delitos")
plt.legend()
plt.xticks(rotation=45)
plt.grid(True)
plt.tight_layout()
plt.show()
print(prediccion_df.head())
print(prediccion_df.tail())
# Crear la gráfica de líneas múltiples
# Filtrar datos
prediccion_df_tlahuac = prediccion_df[prediccion_df["Alcaldía"] == "TLAHUAC"]
prediccion_df_otros = prediccion_df[prediccion_df["Alcaldía"] != "TLAHUAC"]

# Gráfica de Tláhuac
plt.figure(figsize=(14, 6))
plt.plot(prediccion_df_tlahuac["Fecha"], prediccion_df_tlahuac["Predicción de Delitos"], label="Tláhuac", color="red")
plt.title("Predicción de Delitos en Tláhuac")
plt.xlabel("Fecha")
plt.ylabel("Predicción de Delitos")
plt.xticks(rotation=45)
plt.legend()
plt.show()

# Gráfica de otras alcaldías
plt.figure(figsize=(14, 6))
for alcaldia in prediccion_df_otros["Alcaldía"].unique():
    data = prediccion_df_otros[prediccion_df_otros["Alcaldía"] == alcaldia]
    plt.plot(data["Fecha"], data["Predicción de Delitos"], label=alcaldia, alpha=0.7)

plt.title("Predicción de Delitos por Día en Alcaldías Excepto Tláhuac")
plt.xlabel("Fecha")
plt.ylabel("Predicción de Delitos")
plt.legend(title="Alcaldía", bbox_to_anchor=(1.05, 1), loc='upper left')
plt.xticks(rotation=45)
plt.tight_layout()
plt.show()
