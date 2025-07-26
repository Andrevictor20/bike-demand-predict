import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Cloud, Thermometer, Wind, Droplets } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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

interface PredictionFormProps {
  onPredict: (data: PredictionData) => void;
  isLoading?: boolean;
}

export function PredictionForm({ onPredict, isLoading = false }: PredictionFormProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState<PredictionData>({
    date: new Date().toISOString().split('T')[0],
    temperature: 20,
    humidity: 60,
    windSpeed: 10,
    weather: "clear",
    season: "spring",
    holiday: false,
    workingDay: true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validações básicas
    if (formData.temperature < -20 || formData.temperature > 50) {
      toast({
        title: "Erro de validação",
        description: "Temperatura deve estar entre -20°C e 50°C",
        variant: "destructive"
      });
      return;
    }

    if (formData.humidity < 0 || formData.humidity > 100) {
      toast({
        title: "Erro de validação", 
        description: "Umidade deve estar entre 0% e 100%",
        variant: "destructive"
      });
      return;
    }

    onPredict(formData);
  };

  const updateField = (field: keyof PredictionData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Card className="w-full bg-gradient-card border-primary/20 shadow-soft">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2 text-2xl">
          <Calendar className="h-6 w-6 text-primary" />
          Previsão de Demanda
        </CardTitle>
        <CardDescription>
          Insira os dados para prever quantas bicicletas serão alugadas
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Data */}
          <div className="space-y-2">
            <Label htmlFor="date" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Data
            </Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => updateField('date', e.target.value)}
              className="border-primary/20 focus:border-primary"
            />
          </div>

          {/* Grid de condições climáticas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="temperature" className="flex items-center gap-2">
                <Thermometer className="h-4 w-4" />
                Temperatura (°C)
              </Label>
              <Input
                id="temperature"
                type="number"
                min="-20"
                max="50"
                value={formData.temperature}
                onChange={(e) => updateField('temperature', parseFloat(e.target.value))}
                className="border-primary/20 focus:border-primary"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="humidity" className="flex items-center gap-2">
                <Droplets className="h-4 w-4" />
                Umidade (%)
              </Label>
              <Input
                id="humidity"
                type="number"
                min="0"
                max="100"
                value={formData.humidity}
                onChange={(e) => updateField('humidity', parseFloat(e.target.value))}
                className="border-primary/20 focus:border-primary"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="windSpeed" className="flex items-center gap-2">
                <Wind className="h-4 w-4" />
                Velocidade do Vento (km/h)
              </Label>
              <Input
                id="windSpeed"
                type="number"
                min="0"
                max="100"
                value={formData.windSpeed}
                onChange={(e) => updateField('windSpeed', parseFloat(e.target.value))}
                className="border-primary/20 focus:border-primary"
              />
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Cloud className="h-4 w-4" />
                Condição Climática
              </Label>
              <Select value={formData.weather} onValueChange={(value) => updateField('weather', value)}>
                <SelectTrigger className="border-primary/20 focus:border-primary">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="clear">☀️ Ensolarado</SelectItem>
                  <SelectItem value="mist">🌫️ Neblina</SelectItem>
                  <SelectItem value="light_rain">🌦️ Chuva Leve</SelectItem>
                  <SelectItem value="heavy_rain">🌧️ Chuva Pesada</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Estação e outras opções */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Estação do Ano</Label>
              <Select value={formData.season} onValueChange={(value) => updateField('season', value)}>
                <SelectTrigger className="border-primary/20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="spring">🌸 Primavera</SelectItem>
                  <SelectItem value="summer">☀️ Verão</SelectItem>
                  <SelectItem value="fall">🍂 Outono</SelectItem>
                  <SelectItem value="winter">❄️ Inverno</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Tipo de Dia</Label>
              <Select 
                value={formData.holiday ? "holiday" : "normal"} 
                onValueChange={(value) => updateField('holiday', value === "holiday")}
              >
                <SelectTrigger className="border-primary/20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="normal">📅 Dia Normal</SelectItem>
                  <SelectItem value="holiday">🎉 Feriado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Dia da Semana</Label>
              <Select 
                value={formData.workingDay ? "working" : "weekend"} 
                onValueChange={(value) => updateField('workingDay', value === "working")}
              >
                <SelectTrigger className="border-primary/20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="working">💼 Dia Útil</SelectItem>
                  <SelectItem value="weekend">🏖️ Fim de Semana</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full h-12 text-lg" 
            disabled={isLoading}
          >
            {isLoading ? "Processando..." : "🔮 Fazer Previsão"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}