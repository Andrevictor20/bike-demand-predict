import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PredictionForm } from "@/components/PredictionForm";
import { PredictionResult } from "@/components/PredictionResult";
import { PredictionHistory } from "@/components/PredictionHistory";
import { Dashboard } from "@/components/Dashboard";
import { useToast } from "@/hooks/use-toast";
import { Bike, BarChart3, History, Zap } from "lucide-react";
import heroImage from "@/assets/hero-bikes.jpg";

interface PredictionData {
  date: string;
  temperature: number;
  humidity: number;
  windSpeed: number;
  weather: string;
  season: string;
  holiday: boolean;
  workingDay: boolean;
}

interface HistoryItem {
  id: string;
  date: string;
  prediction: number;
  actualWeather: string;
  temperature: number;
  timestamp: Date;
}

interface PredictionResponse {
  prediction: number;
  confidence: number;
}

const Index = () => {
  const { toast } = useToast();
  const [currentPrediction, setCurrentPrediction] = useState<PredictionResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [predictionData, setPredictionData] = useState<PredictionData | null>(null);

  // Simulação da chamada da API para o modelo de ML
  const simulateModelPrediction = (data: PredictionData): Promise<PredictionResponse> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Simulação básica baseada nos fatores
        let basePrediction = 3000;
        
        // Ajuste por temperatura
        if (data.temperature > 25) basePrediction += 1500;
        else if (data.temperature > 15) basePrediction += 800;
        else if (data.temperature < 5) basePrediction -= 1000;
        
        // Ajuste por clima
        switch (data.weather) {
          case "clear": basePrediction += 1200; break;
          case "mist": basePrediction += 200; break;
          case "light_rain": basePrediction -= 800; break;
          case "heavy_rain": basePrediction -= 2000; break;
        }
        
        // Ajuste por estação
        switch (data.season) {
          case "summer": basePrediction += 1000; break;
          case "spring": basePrediction += 500; break;
          case "fall": basePrediction += 200; break;
          case "winter": basePrediction -= 800; break;
        }
        
        // Ajuste por dia da semana e feriado
        if (!data.workingDay) basePrediction += 800;
        if (data.holiday) basePrediction += 400;
        
        // Ajuste por umidade e vento
        if (data.humidity > 80) basePrediction -= 300;
        if (data.windSpeed > 30) basePrediction -= 500;
        
        // Garantir valor mínimo
        basePrediction = Math.max(500, basePrediction);
        
        // Adicionar variação aleatória
        const variation = (Math.random() - 0.5) * 400;
        const finalPrediction = Math.round(basePrediction + variation);
        
        resolve({
          prediction: finalPrediction,
          confidence: Math.round(85 + Math.random() * 10) // 85-95%
        });
      }, 2000); // Simula delay da API
    });
  };

  const handlePredict = async (data: PredictionData) => {
    setIsLoading(true);
    setPredictionData(data);
    
    try {
      // Em produção, aqui seria a chamada real para a API do modelo
      // const response = await fetch('/api/predict', { method: 'POST', body: JSON.stringify(data) });
      // const result = await response.json();
      
      const result = await simulateModelPrediction(data);
      setCurrentPrediction(result);
      
      // Adicionar ao histórico
      const historyItem: HistoryItem = {
        id: crypto.randomUUID(),
        date: data.date,
        prediction: result.prediction,
        actualWeather: data.weather,
        temperature: data.temperature,
        timestamp: new Date()
      };
      
      setHistory(prev => [historyItem, ...prev]);
      
      toast({
        title: "Previsão concluída! 🎉",
        description: `${Math.round(result.prediction).toLocaleString()} bicicletas previstas`,
      });
      
    } catch (error) {
      toast({
        title: "Erro na previsão",
        description: "Não foi possível processar a previsão. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearHistory = () => {
    setHistory([]);
    toast({
      title: "Histórico limpo",
      description: "Todas as previsões foram removidas do histórico.",
    });
  };

  const handleExportCSV = () => {
    if (history.length === 0) {
      toast({
        title: "Histórico vazio",
        description: "Não há dados para exportar.",
        variant: "destructive"
      });
      return;
    }

    const headers = ["Data", "Previsão", "Clima", "Temperatura", "Timestamp"];
    const csvData = history.map(item => [
      item.date,
      item.prediction,
      item.actualWeather,
      `${item.temperature}°C`,
      item.timestamp.toISOString()
    ]);

    const csvContent = [headers, ...csvData]
      .map(row => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `bike_predictions_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);

    toast({
      title: "Exportação concluída! 📊",
      description: "Arquivo CSV baixado com sucesso.",
    });
  };

  const averageDemand = history.length > 0 
    ? history.reduce((sum, item) => sum + item.prediction, 0) / history.length 
    : 0;

  const lastPrediction = history.length > 0 ? history[0].prediction : undefined;

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div 
        className="relative h-96 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-hero flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-5xl font-bold mb-4 flex items-center justify-center gap-3">
              <Bike className="h-12 w-12" />
              BikePredict AI
            </h1>
            <p className="text-xl opacity-90 max-w-2xl mx-auto">
              Sistema inteligente de previsão de demanda para aluguel de bicicletas
            </p>
            <div className="flex items-center justify-center gap-6 mt-6 text-sm">
              <div className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                <span>Previsões em tempo real</span>
              </div>
              <div className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                <span>94% de acurácia</span>
              </div>
              <div className="flex items-center gap-2">
                <History className="h-5 w-5" />
                <span>Histórico completo</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="predict" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="predict" className="flex items-center gap-2">
              <Bike className="h-4 w-4" />
              Fazer Previsão
            </TabsTrigger>
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2">
              <History className="h-4 w-4" />
              Histórico
            </TabsTrigger>
          </TabsList>

          <TabsContent value="predict" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <PredictionForm 
                onPredict={handlePredict} 
                isLoading={isLoading}
              />
              
              {currentPrediction && predictionData && (
                <PredictionResult
                  prediction={currentPrediction.prediction}
                  confidence={currentPrediction.confidence}
                  date={predictionData.date}
                  weather={predictionData.weather}
                  temperature={predictionData.temperature}
                />
              )}
            </div>
          </TabsContent>

          <TabsContent value="dashboard">
            <Dashboard
              totalPredictions={history.length}
              averageDemand={averageDemand}
              lastPrediction={lastPrediction}
            />
          </TabsContent>

          <TabsContent value="history">
            <PredictionHistory
              history={history}
              onClearHistory={handleClearHistory}
              onExportCSV={handleExportCSV}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;