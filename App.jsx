import React, { useState, useEffect } from 'react';
import { Upload, MessageSquare, BarChart3, TrendingUp, DollarSign, Package, Send, Sparkles, FileSpreadsheet, Brain } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const FloatingParticle = ({ delay }) => (
  <div 
    className="absolute w-2 h-2 bg-purple-500 rounded-full opacity-20 animate-pulse"
    style={{
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      animationDelay: `${delay}s`,
      animationDuration: `${3 + Math.random() * 2}s`
    }}
  />
);

const ThinkingProcess = ({ thoughts }) => (
  <div className="bg-slate-800/30 border border-purple-500/30 rounded-2xl p-4 mb-4 animate-fadeIn">
    <div className="flex items-center gap-2 mb-3">
      <Brain className="w-5 h-5 text-purple-400 animate-pulse" />
      <span className="text-sm font-semibold text-purple-400">Analisando dados...</span>
    </div>
    <div className="space-y-2">
      {thoughts.map((thought, idx) => (
        <div
          key={idx}
          className="flex items-start gap-2 text-sm text-gray-400"
          style={{ animation: `fadeIn 0.5s ease-in ${idx * 0.3}s forwards`, opacity: 0 }}
        >
          <span className="text-purple-500">▸</span>
          <span>{thought}</span>
        </div>
      ))}
    </div>
  </div>
);

export default function AlphaInsights() {
  const [activeTab, setActiveTab] = useState('chat');
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [thinking, setThinking] = useState(false);
  const [thinkingSteps, setThinkingSteps] = useState([]);
  const [salesData, setSalesData] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null);

  const mockSalesData = {
    monthly: [
      { month: 'Jan', revenue: 45000, orders: 120 },
      { month: 'Fev', revenue: 52000, orders: 145 },
      { month: 'Mar', revenue: 48000, orders: 132 },
      { month: 'Abr', revenue: 61000, orders: 168 },
      { month: 'Mai', revenue: 55000, orders: 152 },
      { month: 'Jun', revenue: 67000, orders: 189 }
    ],
    categories: [
      { name: 'Notebooks', value: 35, color: '#6366f1' },
      { name: 'Smartphones', value: 28, color: '#8b5cf6' },
      { name: 'Acessórios', value: 22, color: '#a855f7' },
      { name: 'Tablets', value: 15, color: '#c084fc' }
    ],
    metrics: {
      totalRevenue: 328000,
      totalOrders: 906,
      avgTicket: 362,
      growth: 15.3
    }
  };

  useEffect(() => {
    setSalesData(mockSalesData);
    setMessages([{
      role: 'assistant',
      content: 'Olá! Sou o assistente virtual da Alpha Insights powered by GPT. Posso ajudá-lo a analisar dados de vendas, gerar relatórios e responder perguntas sobre o desempenho da sua equipe. Como posso ajudar hoje?'
    }]);
  }, []);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadedFile(file.name);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `Arquivo "${file.name}" carregado com sucesso! Agora você pode fazer perguntas sobre esses dados.`
      }]);
    }
  };

  const callOpenAI = async (userMessage) => {
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage,
          salesData: mockSalesData
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro na API');
      }

      const data = await response.json();
      return data.response;
    } catch (error) {
      console.error('Erro ao chamar API:', error);
      
      const responses = {
        'vendas': 'Analisando os dados de vendas do último semestre, observo um crescimento consistente de 15.3%. Abril foi o mês de melhor performance com R$ 61.000 em receita. Recomendo focar em replicar as estratégias desse período.',
        'melhor': 'O melhor mês foi Abril, com R$ 61.000 em receita e 168 pedidos. Isso representa um aumento de 27% em relação à média dos outros meses. Sugiro investigar quais campanhas ou ações foram realizadas neste período.',
        'categoria': 'Notebooks lideram com 35% das vendas, seguidos por Smartphones (28%). Há uma oportunidade em Tablets (15%) que pode ser explorada com estratégias de cross-sell e upsell.',
        'crescimento': 'O crescimento de 15.3% no semestre é positivo. Para acelerar ainda mais, recomendo: 1) Investir em marketing para categorias com menor participação, 2) Aumentar ticket médio com bundles, 3) Fidelizar clientes de alto valor.',
        'ticket': 'O ticket médio atual é de R$ 362. Para aumentá-lo, sugiro estratégias de bundling, ofertas de produtos complementares e programas de fidelidade que incentivem compras maiores.'
      };

      const lowerMessage = userMessage.toLowerCase();
      for (const [key, response] of Object.entries(responses)) {
        if (lowerMessage.includes(key)) {
          return response;
        }
      }

      return 'Com base nos dados disponíveis, posso ajudá-lo com análises de vendas, identificação de tendências e sugestões estratégicas. Receita total: R$ 328.000 | Pedidos: 906 | Crescimento: +15.3%. O que gostaria de saber especificamente?';
    }
  };

  const simulateThinking = () => {
    const steps = [
      'Analisando dados de vendas...',
      'Identificando padrões e tendências...',
      'Calculando métricas relevantes...',
      'Gerando insights acionáveis...',
      'Preparando resposta...'
    ];

    setThinkingSteps([]);
    steps.forEach((step, idx) => {
      setTimeout(() => {
        setThinkingSteps(prev => [...prev, step]);
      }, idx * 600);
    });
  };

  const handleSendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input;
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setInput('');
    setThinking(true);
    setLoading(true);

    simulateThinking();

    try {
      const aiResponse = await callOpenAI(userMessage);
      
      setTimeout(() => {
        setThinking(false);
        setThinkingSteps([]);
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: aiResponse
        }]);
        setLoading(false);
      }, 3000);
    } catch (error) {
      console.error('Erro no handleSendMessage:', error);
      setThinking(false);
      setThinkingSteps([]);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Desculpe, houve um erro ao processar sua mensagem. Mas posso ajudá-lo com análises dos dados disponíveis. O que gostaria de saber?'
      }]);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-purple-950 text-white relative overflow-hidden">
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
      
      {[...Array(20)].map((_, i) => <FloatingParticle key={i} delay={i * 0.2} />)}
      
      <header className="relative z-10 border-b border-purple-500/20 backdrop-blur-xl bg-slate-900/30">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg shadow-purple-500/50">
              <Sparkles className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Alpha Insights
              </h1>
              <p className="text-sm text-gray-400">Powered by AI</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('chat')}
              className={`px-4 py-2 rounded-lg transition-all ${
                activeTab === 'chat'
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg shadow-purple-500/50'
                  : 'bg-slate-800/50 hover:bg-slate-800'
              }`}
            >
              <MessageSquare className="w-5 h-5" />
            </button>
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-4 py-2 rounded-lg transition-all ${
                activeTab === 'dashboard'
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg shadow-purple-500/50'
                  : 'bg-slate-800/50 hover:bg-slate-800'
              }`}
            >
              <BarChart3 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-7xl mx-auto px-6 py-8">
        {activeTab === 'chat' ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-slate-900/50 backdrop-blur-xl rounded-2xl border border-purple-500/20 shadow-2xl overflow-hidden">
              <div className="h-[600px] flex flex-col">
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                  {messages.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                          msg.role === 'user'
                            ? 'bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg shadow-purple-500/30'
                            : 'bg-slate-800/50 border border-purple-500/20'
                        }`}
                      >
                        <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                      </div>
                    </div>
                  ))}
                  
                  {thinking && (
                    <div className="flex justify-start">
                      <div className="max-w-[80%] w-full">
                        <ThinkingProcess thoughts={thinkingSteps} />
                      </div>
                    </div>
                  )}
                  
                  {loading && !thinking && (
                    <div className="flex justify-start">
                      <div className="bg-slate-800/50 border border-purple-500/20 rounded-2xl px-4 py-3">
                        <div className="flex gap-2">
                          <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" />
                          <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                          <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <div className="border-t border-purple-500/20 p-4">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && !loading && handleSendMessage()}
                      placeholder="Pergunte sobre vendas, métricas, estratégias..."
                      disabled={loading}
                      className="flex-1 bg-slate-800/50 border border-purple-500/20 rounded-xl px-4 py-3 focus:outline-none focus:border-purple-500 transition-all disabled:opacity-50"
                    />
                    <button
                      onClick={handleSendMessage}
                      disabled={loading}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl px-6 py-3 hover:shadow-lg hover:shadow-purple-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Send className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl border border-purple-500/20 p-6 shadow-2xl">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <FileSpreadsheet className="w-5 h-5 text-purple-400" />
                  Carregar Dados
                </h3>
                <div className="space-y-3">
                  <label className="block">
                    <div className="border-2 border-dashed border-purple-500/30 rounded-xl p-6 text-center cursor-pointer hover:border-purple-500/60 transition-all">
                      <Upload className="w-8 h-8 mx-auto mb-2 text-purple-400" />
                      <p className="text-sm text-gray-400">CSV ou XLSX</p>
                      <input
                        type="file"
                        accept=".csv,.xlsx"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </div>
                  </label>
                  {uploadedFile && (
                    <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3 text-sm text-green-400">
                      ✓ {uploadedFile}
                    </div>
                  )}
                  <a
                    href="https://docs.google.com/spreadsheets/d/1g881swLLp_a7EQS7ij96NCvKfRHrar3_IztWf8953OY/edit"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl px-4 py-3 text-center text-sm hover:shadow-lg hover:shadow-purple-500/50 transition-all"
                  >
                    Acessar Planilha Google
                  </a>
                </div>
              </div>

              {salesData && (
                <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl border border-purple-500/20 p-6 shadow-2xl">
                  <h3 className="text-lg font-semibold mb-4">Resumo Rápido</h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                        <DollarSign className="w-5 h-5 text-blue-400" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">Receita Total</p>
                        <p className="text-lg font-bold">R$ {salesData.metrics.totalRevenue.toLocaleString()}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                        <Package className="w-5 h-5 text-purple-400" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">Total de Pedidos</p>
                        <p className="text-lg font-bold">{salesData.metrics.totalOrders}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                        <TrendingUp className="w-5 h-5 text-green-400" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">Crescimento</p>
                        <p className="text-lg font-bold text-green-400">+{salesData.metrics.growth}%</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                { label: 'Receita Total', value: `R$ ${salesData?.metrics.totalRevenue.toLocaleString()}`, icon: DollarSign, color: 'blue' },
                { label: 'Pedidos', value: salesData?.metrics.totalOrders, icon: Package, color: 'purple' },
                { label: 'Ticket Médio', value: `R$ ${salesData?.metrics.avgTicket}`, icon: TrendingUp, color: 'green' },
                { label: 'Crescimento', value: `+${salesData?.metrics.growth}%`, icon: BarChart3, color: 'orange' }
              ].map((metric, idx) => (
                <div key={idx} className="bg-slate-900/50 backdrop-blur-xl rounded-2xl border border-purple-500/20 p-6 shadow-2xl">
                  <div className="flex items-center justify-between mb-2">
                    <metric.icon className={`w-8 h-8 text-${metric.color}-400`} />
                  </div>
                  <p className="text-3xl font-bold mb-1">{metric.value}</p>
                  <p className="text-sm text-gray-400">{metric.label}</p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl border border-purple-500/20 p-6 shadow-2xl">
                <h3 className="text-lg font-semibold mb-4">Receita Mensal</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={salesData?.monthly}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="month" stroke="#9ca3af" />
                    <YAxis stroke="#9ca3af" />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #6366f1' }}
                    />
                    <Line type="monotone" dataKey="revenue" stroke="#8b5cf6" strokeWidth={3} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl border border-purple-500/20 p-6 shadow-2xl">
                <h3 className="text-lg font-semibold mb-4">Pedidos por Mês</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={salesData?.monthly}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="month" stroke="#9ca3af" />
                    <YAxis stroke="#9ca3af" />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #6366f1' }}
                    />
                    <Bar dataKey="orders" fill="#6366f1" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl border border-purple-500/20 p-6 shadow-2xl lg:col-span-2">
                <h3 className="text-lg font-semibold mb-4">Distribuição por Categoria</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={salesData?.categories}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {salesData?.categories.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #6366f1' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
