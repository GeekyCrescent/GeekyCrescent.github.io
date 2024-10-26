import pandas as pd
import numpy as np
from sklearn.preprocessing import LabelEncoder
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM, Dense, Dropout
from tensorflow.keras.optimizers import Adam
from sklearn.model_selection import train_test_split
from datetime import timedelta

# Cargar y procesar los datos
datos = pd.read_csv("carpetasFGJ_2023.csv").dropna()
datos["fecha_hecho"] = pd.to_datetime(datos["fecha_hecho"])
datos = datos[["fecha_hecho", "alcaldia_hecho"]]

# Agrupar datos por día y alcaldía para contar delitos diarios
datos["fecha"] = datos["fecha_hecho"].dt.date
delitos_diarios = datos.groupby(["fecha", "alcaldia_hecho"]).size().reset_index(name="num_delitos")

# Codificar las alcaldías
encoder_alcaldia = LabelEncoder()
delitos_diarios["alcaldia_encoded"] = encoder_alcaldia.fit_transform(delitos_diarios["alcaldia_hecho"])

# Crear series de tiempo por cada alcaldía
alcaldias = delitos_diarios["alcaldia_encoded"].unique()
delitos_por_dia = {}
predicciones_futuras = {}

# Función para preparar datos en secuencias
def crear_secuencias(datos, n_steps):
    X, y = [], []
    for i in range(len(datos) - n_steps):
        X.append(datos[i:i + n_steps])
        y.append(datos[i + n_steps])
    return np.array(X), np.array(y)

# Parámetros del modelo
n_steps = 30  # Aumentar ventana de tiempo
epochs = 100  # Aumentar épocas
batch_size = 16
learning_rate = 0.0005  # Disminuir tasa de aprendizaje

for alcaldia in alcaldias:
    # Filtrar datos para la alcaldía actual
    serie_alcaldia = delitos_diarios[delitos_diarios["alcaldia_encoded"] == alcaldia]["num_delitos"].values

    # Crear secuencias de entrenamiento
    X, y = crear_secuencias(serie_alcaldia, n_steps)

    # Dividir en entrenamiento y validación
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    # Redimensionar los datos de entrada para el LSTM
    X_train = X_train.reshape((X_train.shape[0], X_train.shape[1], 1))
    X_test = X_test.reshape((X_test.shape[0], X_test.shape[1], 1))

    # Crear modelo LSTM con mejoras
    model = Sequential()
    model.add(LSTM(100, activation='relu', return_sequences=True, input_shape=(n_steps, 1)))
    model.add(Dropout(0.2))
    model.add(LSTM(50, activation='relu'))
    model.add(Dropout(0.2))
    model.add(Dense(1))
    model.compile(optimizer=Adam(learning_rate=learning_rate), loss='mse')

    # Entrenar modelo
    model.fit(X_train, y_train, epochs=epochs, batch_size=batch_size, validation_data=(X_test, y_test), verbose=0)

    # Generar predicción para los próximos 180 días
    secuencia_prediccion = serie_alcaldia[-n_steps:].reshape((1, n_steps, 1))
    predicciones_alcaldia = []

    for i in range(180):
        prediccion = model.predict(secuencia_prediccion)
        predicciones_alcaldia.append(prediccion[0, 0])

        prediccion_reshape = np.reshape(prediccion, (1, 1, 1))
        secuencia_prediccion = np.append(secuencia_prediccion[:, 1:, :], prediccion_reshape, axis=1)

    predicciones_futuras[encoder_alcaldia.inverse_transform([alcaldia])[0]] = np.round(predicciones_alcaldia).astype(int)

# Exportar resultados a CSV
predicciones_df = pd.DataFrame(predicciones_futuras)
predicciones_df.to_csv("prediccion_180_dias.csv", index=False)
print("Predicciones guardadas en predicciones_180_dias.csv")
