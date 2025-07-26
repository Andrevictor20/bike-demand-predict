import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { History, Download, Trash2, Calendar } from "lucide-react";

interface HistoryItem {
  id: string;
  date: string;
  prediction: number;
  actualWeather: string;
  temperature: number;
  timestamp: Date;
}

interface PredictionHistoryProps {
  history: HistoryItem[];
  onClearHistory: () => void;
  onExportCSV: () => void;
}

export function PredictionHistory({ 
  history, 
  onClearHistory, 
  onExportCSV 
}: PredictionHistoryProps) {
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');

  const sortedHistory = [...history].sort((a, b) => {
    if (sortOrder === 'newest') {
      return b.timestamp.getTime() - a.timestamp.getTime();
    }
    return a.timestamp.getTime() - b.timestamp.getTime();
  });

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('pt-BR');
  };

  const formatTimestamp = (timestamp: Date) => {
    return timestamp.toLocaleString('pt-BR');
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

  const getDemandColor = (prediction: number) => {
    if (prediction < 2000) return "bg-yellow-100 text-yellow-800";
    if (prediction < 5000) return "bg-blue-100 text-blue-800";
    if (prediction < 7000) return "bg-green-100 text-green-800";
    return "bg-red-100 text-red-800";
  };

  if (history.length === 0) {
    return (
      <Card className="bg-gradient-card border-primary/20">
        <CardContent className="text-center py-8">
          <History className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">
            Nenhuma previsão feita ainda. Faça sua primeira previsão!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-card border-primary/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5 text-primary" />
            Histórico de Previsões
          </CardTitle>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSortOrder(sortOrder === 'newest' ? 'oldest' : 'newest')}
            >
              <Calendar className="h-4 w-4 mr-2" />
              {sortOrder === 'newest' ? 'Mais Recentes' : 'Mais Antigas'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onExportCSV}
            >
              <Download className="h-4 w-4 mr-2" />
              Exportar CSV
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={onClearHistory}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Limpar
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {sortedHistory.map((item) => (
            <div 
              key={item.id}
              className="flex items-center justify-between p-3 bg-background rounded-lg border border-primary/10 hover:border-primary/20 transition-colors"
            >
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <span className="font-medium">{formatDate(item.date)}</span>
                  <div className="flex items-center gap-1">
                    <span>{getWeatherEmoji(item.actualWeather)}</span>
                    <span className="text-sm text-muted-foreground">
                      {item.temperature}°C
                    </span>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  Previsão feita em: {formatTimestamp(item.timestamp)}
                </p>
              </div>
              
              <div className="text-right">
                <Badge 
                  variant="secondary" 
                  className={`${getDemandColor(item.prediction)} border-0 mb-1`}
                >
                  {Math.round(item.prediction).toLocaleString()} bikes
                </Badge>
                <p className="text-xs text-muted-foreground">
                  {item.prediction < 2000 ? 'Baixa' : 
                   item.prediction < 5000 ? 'Média' : 
                   item.prediction < 7000 ? 'Alta' : 'Muito Alta'}
                </p>
              </div>
            </div>
          ))}
        </div>
        
        {history.length > 0 && (
          <div className="mt-4 pt-4 border-t border-primary/10">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Total de previsões: {history.length}</span>
              <span>
                Média: {Math.round(history.reduce((sum, item) => sum + item.prediction, 0) / history.length).toLocaleString()} bikes
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}