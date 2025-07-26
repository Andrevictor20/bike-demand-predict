import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { TrendingUp, Users, Bike, Calendar } from "lucide-react";

const mockTrendData = [
  { date: "Jan", predicted: 3200, actual: 3100 },
  { date: "Fev", predicted: 3500, actual: 3400 },
  { date: "Mar", predicted: 4200, actual: 4000 },
  { date: "Abr", predicted: 4800, actual: 4900 },
  { date: "Mai", predicted: 5200, actual: 5100 },
  { date: "Jun", predicted: 5800, actual: 5700 },
];

const mockWeatherData = [
  { weather: "Ensolarado", bikes: 5800, color: "#22c55e" },
  { weather: "Nublado", bikes: 4200, color: "#3b82f6" },
  { weather: "Chuva Leve", bikes: 2800, color: "#f59e0b" },
  { weather: "Chuva Forte", bikes: 1200, color: "#ef4444" },
];

interface DashboardProps {
  totalPredictions: number;
  averageDemand: number;
  lastPrediction?: number;
}

export function Dashboard({ 
  totalPredictions, 
  averageDemand, 
  lastPrediction 
}: DashboardProps) {
  return (
    <div className="space-y-6">
      {/* Métricas principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-card border-primary/20">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-primary/10 rounded-lg mr-4">
                <Calendar className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total de Previsões</p>
                <p className="text-2xl font-bold">{totalPredictions}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-primary/20">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg mr-4">
                <TrendingUp className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Demanda Média</p>
                <p className="text-2xl font-bold">{Math.round(averageDemand).toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-primary/20">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg mr-4">
                <Bike className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Última Previsão</p>
                <p className="text-2xl font-bold">
                  {lastPrediction ? Math.round(lastPrediction).toLocaleString() : "—"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-primary/20">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg mr-4">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Acurácia Modelo</p>
                <p className="text-2xl font-bold">94.2%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico de Tendências */}
        <Card className="bg-gradient-card border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Tendência Mensal
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={mockTrendData}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="predicted" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={3}
                    name="Previsto"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="actual" 
                    stroke="#3b82f6" 
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    name="Real"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Gráfico por Condição Climática */}
        <Card className="bg-gradient-card border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bike className="h-5 w-5 text-primary" />
              Demanda por Clima
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={mockWeatherData}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis dataKey="weather" />
                  <YAxis />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <Bar 
                    dataKey="bikes" 
                    fill="hsl(var(--primary))"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Insights do Dashboard */}
      <Card className="bg-accent/30 border-primary/20">
        <CardHeader>
          <CardTitle>📊 Insights do Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-semibold text-primary">Tendências Observadas</h4>
              <ul className="text-sm space-y-1">
                <li>• Pico de demanda nos meses de primavera/verão</li>
                <li>• Clima ensolarado aumenta demanda em 40%</li>
                <li>• Fins de semana têm 25% mais aluguel</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-primary">Recomendações</h4>
              <ul className="text-sm space-y-1">
                <li>• Concentrar estoque em dias ensolarados</li>
                <li>• Manutenção programada em dias chuvosos</li>
                <li>• Campanhas promocionais no inverno</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}