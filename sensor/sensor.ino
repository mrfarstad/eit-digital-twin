#include <ESP8266WiFi.h>
#include <Adafruit_BME280.h>
#include "Adafruit_CCS811.h"
#include <PubSubClient.h>
#include <ArduinoJson.h>

#define SEALEVELPRESSURE_HPA (1013.25)

Adafruit_BME280 bme;
Adafruit_CCS811 ccs;

float temperature, humidity, pressure, altitude, eco2, tvoc;

/*Put your SSID & Password*/

const char* ssid = "eksperter_i_team";  // Enter SSID here
const char* password = "wednesday420";  //Enter Password here

const char* mqtt_server = "192.168.2.100";
/*
const char* ssid = "Nedre Alle";  // Enter SSID here
const char* password = "vi bor i nedre alle";  //Enter Password here
const char* mqtt_server = "192.168.0.152";
*/
WiFiClient espClient;
PubSubClient client(espClient);
 
void setup() {
  Serial.begin(115200);
  delay(100);
  
  bme.begin(0x76);
  
  if(!ccs.begin()){
    Serial.println("Failed to start CCS811 sensor! Please check your wiring.");
    while(1);
  }
  
  // Wait for the sensor to be ready
  while(!ccs.available());   

  Serial.println("Connecting to ");
  Serial.println(ssid);

  //connect to your local wi-fi network
  WiFi.begin(ssid, password);

  //check wi-fi is connected to wi-fi network
  while (WiFi.status() != WL_CONNECTED) {
  delay(1000);
  Serial.print(".");
  }
  Serial.println("");
  Serial.println("WiFi connected..!");
  Serial.print("Got IP: ");  Serial.println(WiFi.localIP());
  Serial.println("HTTP server started");
  
  randomSeed(micros());
  
  client.setServer(mqtt_server, 1883);
}

void callback(char* topic, byte* payload, unsigned int length) {
  Serial.print("Message arrived [");
  Serial.print(topic);
  Serial.print("] ");
  for (int i = 0; i < length; i++) {
    Serial.print((char)payload[i]);
  }
  Serial.println();
}

void reconnect() {
  // Loop until we're reconnected
  while (!client.connected()) {
    Serial.print("Attempting MQTT connection...");
    // Create a random client ID
    String clientId = "ESP8266Client-";
    clientId += String(random(0xffff), HEX);
    // Attempt to connect
    if (client.connect(clientId.c_str())) {
      Serial.println("connected");
      // Once connected, publish an announcement...
      /*client.publish("outTopic", "hello world");*/
      // ... and resubscribe
      /*client.subscribe("inTopic");*/
    } else {
      Serial.print("failed, rc=");
      Serial.print(client.state());
      Serial.println(" try again in 5 seconds");
      // Wait 5 seconds before retrying
      delay(5000);
    }
  }
}

const int capacity = JSON_OBJECT_SIZE(5);
StaticJsonDocument<capacity> doc;

long lastMsg = 0;

void loop() {
  if (!client.connected()) {
    reconnect();
  }
  client.loop();

  long now = millis();
  if (now - lastMsg > 2000) {
    lastMsg = now;
  
  if (!ccs.readData()) {
    eco2 = ccs.geteCO2();
    tvoc = ccs.getTVOC();
  }
  temperature = bme.readTemperature();
  humidity = bme.readHumidity();
  pressure = bme.readPressure() / 100.0F;

  doc["temperature"] = temperature;
  doc["humidity"] = humidity;
  doc["pressure"] = pressure;
  doc["eCO2"] = eco2;
  doc["TVOC"] = tvoc;

  char output[128];
  serializeJson(doc, output);

  client.publish("sensor", output);
  }
}
