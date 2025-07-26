import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bike, TrendingUp, Calendar, Users } from "lucide-react";

interface PredictionResultProps {
  prediction: number;
  confidence?: number;
  date: string;
  weather: string;
  temperature: number;
}

export function PredictionResult({ 
  prediction, 
  confidence = 85, 
  date, 
  weather, 
  temperature 
}: PredictionResultProps) {
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('pt-BR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getWeatherEmoji = (weather: string) => {
    const weatherMap: Record<string, string> = {
      clear: "☀️",
      mist: "🌫️", 
      light_rain: "🌦️",
      heavy_rain: "🌧️"
    };
    return weatherMap[weather] || "🌤️";
  };

  const getDemandLevel = (count: number) => {
    if (count < 2000) return { level: "Baixa", color: "bg-yellow-500", textColor: "text-yellow-700" };
    if (count < 5000) return { level: "Média", color: "bg-blue-500", textColor: "text-blue-700" };
    if (count < 7000) return { level: "Alta", color: "bg-green-500", textColor: "text-green-700" };
    return { level: "Muito Alta", color: "bg-red-500", textColor: "text-red-700" };
  };

  const demandInfo = getDemandLevel(prediction);

  return (
    <div className="space-y-4">
      {/* Resultado Principal */}
      <Card className="bg-gradient-primary text-white border-0 shadow-glow">
        <CardHeader className="text-center pb-2">
          <CardTitle className="flex items-center justify-center gap-2 text-2xl">
            <Bike className="h-8 w-8" />
            Previsão de Demanda
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <div className="text-6xl font-bold mb-2">
            {Math.round(prediction).toLocaleString()}
          </div>
          <p className="text-xl opacity-90 mb-4">bicicletas alugadas</p>
          <div className="flex items-center justify-center gap-2">
            <TrendingUp className="h-5 w-5" />
            <span className="text-lg">Confiança: {confidence}%</span>
          </div>
        </CardContent>
      </Card>

      {/* Detalhes da Previsão */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="bg-gradient-card border-primary/20">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Calendar className="h-5 w-5 text-primary" />
              Informações do Dia
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Data:</span>
              <span className="font-medium">{formatDate(date)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Clima:</span>
              <div className="flex items-center gap-2">
                <span>{getWeatherEmoji(weather)}</span>
                <span className="font-medium">{temperature}°C</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-primary/20">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Users className="h-5 w-5 text-primary" />
              Análise da Demanda
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Nível:</span>
              <Badge variant="secondary" className={`${demandInfo.color} text-white`}>
                {demandInfo.level}
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Categoria:</span>
              <span className="font-medium">
                {prediction > 4000 ? "Pico de Uso" : "Uso Normal"}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Insights */}
      <Card className="bg-accent/30 border-primary/20">
        <CardContent className="pt-6">
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            💡 Insights e Recomendações
          </h3>
          <ul className="space-y-2 text-sm">
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              <span>
                {demandInfo.level === "Alta" || demandInfo.level === "Muito Alta" 
                  ? "Alta demanda prevista - considere aumentar o estoque de bicicletas"
                  : "Demanda moderada - estoque normal é suficiente"
                }
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              <span>
                {temperature > 25 
                  ? "Temperatura alta favorece o uso de bicicletas"
                  : temperature < 10 
                  ? "Temperatura baixa pode reduzir a demanda"
                  : "Temperatura adequada para ciclismo"
                }
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              <span>
                Monitore as condições em tempo real para ajustes na distribuição
              </span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}