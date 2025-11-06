import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, LineChart, Line, Legend } from 'recharts';
import { Wallet, TrendingUp, DollarSign, Plus, Trash2, Edit2, Save, X, AlertCircle, CheckCircle, Download, BarChart3, Target, Brain } from 'lucide-react';

const MinhasFinancas = () => {
  const [salary, setSalary] = useState(5000);
  const [expenses, setExpenses] = useState([
    { id: 1, name: 'Aluguel', amount: 1500, category: 'Moradia', date: '2025-11-01' },
    { id: 2, name: 'Alimentação', amount: 800, category: 'Alimentação', date: '2025-11-05' },
    { id: 3, name: 'Transporte', amount: 400, category: 'Transporte', date: '2025-11-03' },
    { id: 4, name: 'Lazer', amount: 300, category: 'Lazer', date: '2025-11-02' }
  ]);
  const [newExpense, setNewExpense] = useState({ name: '', amount: '', category: 'Moradia' });
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', amount: '', category: '' });
  const [showInsights, setShowInsights] = useState(false);
  const [savingsGoal, setSavingsGoal] = useState(1000);

  const categories = ['Moradia', 'Alimentação', 'Transporte', 'Saúde', 'Lazer', 'Educação', 'Investimentos', 'Outros'];
  
  const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6', '#14b8a6', '#ef4444'];

  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const remaining = salary - totalExpenses;
  const percentageUsed = ((totalExpenses / salary) * 100).toFixed(1);
  const savingsRate = ((remaining / salary) * 100).toFixed(1);

  const categoryData = categories.map(cat => {
    const total = expenses
      .filter(exp => exp.category === cat)
      .reduce((sum, exp) => sum + exp.amount, 0);
    return { name: cat, value: total };
  }).filter(item => item.value > 0);

  const monthlyTrend = [
    { month: 'Ago', receita: 5000, despesa: 4200, economia: 800 },
    { month: 'Set', receita: 5000, despesa: 3800, economia: 1200 },
    { month: 'Out', receita: 5000, despesa: 3500, economia: 1500 },
    { month: 'Nov', receita: salary, despesa: totalExpenses, economia: remaining }
  ];

  const generateInsights = () => {
    const insights = [];
    
    if (remaining < 0) {
      insights.push({
        type: 'alert',
        title: 'Atenção: Déficit Orçamentário',
        message: `Suas despesas excedem sua receita em R$ ${Math.abs(remaining).toFixed(2)}. Recomendamos análise imediata das categorias com maior impacto.`,
        icon: AlertCircle,
        color: 'red'
      });
    } else if (remaining < salary * 0.1) {
      insights.push({
        type: 'warning',
        title: 'Taxa de Poupança Abaixo do Ideal',
        message: `Você está economizando ${savingsRate}% da receita. Especialistas recomendam pelo menos 20% para construção de patrimônio sustentável.`,
        icon: AlertCircle,
        color: 'orange'
      });
    } else if (remaining >= savingsGoal) {
      insights.push({
        type: 'success',
        title: 'Meta de Poupança Alcançada',
        message: `Excelente performance! Você atingiu sua meta de economia mensal de R$ ${savingsGoal.toFixed(2)}.`,
        icon: CheckCircle,
        color: 'green'
      });
    }

    const biggestExpense = expenses.reduce((max, exp) => exp.amount > max.amount ? exp : max, expenses[0]);
    if (biggestExpense && biggestExpense.amount > salary * 0.3) {
      insights.push({
        type: 'info',
        title: 'Concentração de Despesas',
        message: `${biggestExpense.category} representa ${((biggestExpense.amount / totalExpenses) * 100).toFixed(1)}% do seu orçamento. Analise oportunidades de otimização nesta categoria.`,
        icon: BarChart3,
        color: 'blue'
      });
    }

    return insights;
  };

  const addExpense = () => {
    if (newExpense.name && newExpense.amount) {
      setExpenses([
        ...expenses,
        {
          id: Date.now(),
          name: newExpense.name,
          amount: parseFloat(newExpense.amount),
          category: newExpense.category,
          date: new Date().toISOString().split('T')[0]
        }
      ]);
      setNewExpense({ name: '', amount: '', category: 'Moradia' });
    }
  };

  const deleteExpense = (id) => {
    setExpenses(expenses.filter(exp => exp.id !== id));
  };

  const startEdit = (expense) => {
    setEditingId(expense.id);
    setEditForm({ name: expense.name, amount: expense.amount, category: expense.category });
  };

  const saveEdit = (id) => {
    setExpenses(expenses.map(exp => 
      exp.id === id ? { ...exp, ...editForm, amount: parseFloat(editForm.amount) } : exp
    ));
    setEditingId(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  const exportReport = () => {
    const report = `
MINHASFINANÇAS - RELATÓRIO DE PERFORMANCE FINANCEIRA
Data: ${new Date().toLocaleDateString('pt-BR')}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

RESUMO EXECUTIVO
Receita Total: R$ ${salary.toFixed(2)}
Despesas Totais: R$ ${totalExpenses.toFixed(2)}
Saldo Líquido: R$ ${remaining.toFixed(2)}
Taxa de Utilização: ${percentageUsed}%
Taxa de Poupança: ${savingsRate}%

ANÁLISE POR CATEGORIA
${categoryData.map(cat => 
  `${cat.name}: R$ ${cat.value.toFixed(2)} (${((cat.value/totalExpenses)*100).toFixed(1)}%)`
).join('\n')}

DETALHAMENTO DE DESPESAS
${expenses.map(exp => 
  `${exp.name} - ${exp.category}: R$ ${exp.amount.toFixed(2)}`
).join('\n')}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Relatório gerado automaticamente pela plataforma MinhasFinanças
Tecnologia a serviço da inteligência financeira
    `;
    
    const blob = new Blob([report], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `relatorio-financeiro-${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
  };

  const insights = generateInsights();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Header Premium */}
      <header className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
                <Brain className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold">MinhasFinanças</h1>
                <p className="text-indigo-100 text-sm">Inteligência Financeira Digital</p>
              </div>
            </div>
            <button
              onClick={exportReport}
              className="bg-white/20 hover:bg-white/30 backdrop-blur-sm px-4 py-2 rounded-lg transition-all flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              <span className="hidden md:inline">Exportar Relatório</span>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-4 md:p-6">
        {/* Insights Inteligentes */}
        {insights.length > 0 && (
          <div className="mb-6 space-y-3">
            {insights.map((insight, idx) => {
              const Icon = insight.icon;
              const colorMap = {
                red: 'from-red-500 to-red-600',
                orange: 'from-orange-500 to-orange-600',
                green: 'from-green-500 to-green-600',
                blue: 'from-blue-500 to-blue-600'
              };
              return (
                <div key={idx} className={`bg-gradient-to-r ${colorMap[insight.color]} rounded-xl p-4 text-white shadow-lg`}>
                  <div className="flex items-start gap-3">
                    <Icon className="w-6 h-6 flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-bold text-lg mb-1">{insight.title}</h3>
                      <p className="text-white/90 text-sm leading-relaxed">{insight.message}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Dashboard Principal */}
        <div className="bg-white rounded-2xl shadow-xl p-4 md:p-8 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Dashboard de Performance</h2>
              <p className="text-gray-600 text-sm">Análise automatizada em tempo real</p>
            </div>
            <button
              onClick={() => setShowInsights(!showInsights)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
            >
              <Brain className="w-4 h-4" />
              IA Insights
            </button>
          </div>

          {/* KPIs Principais */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl p-6 text-white shadow-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm opacity-90 font-medium">Receita Mensal</span>
                <DollarSign className="w-5 h-5" />
              </div>
              <p className="text-3xl font-bold mb-1">R$ {salary.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</p>
              <p className="text-xs opacity-75">Base para análise</p>
            </div>

            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm opacity-90 font-medium">Despesas Totais</span>
                <TrendingUp className="w-5 h-5" />
              </div>
              <p className="text-3xl font-bold mb-1">R$ {totalExpenses.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</p>
              <p className="text-xs opacity-75">{percentageUsed}% do orçamento</p>
            </div>

            <div className={`bg-gradient-to-br ${remaining >= 0 ? 'from-green-500 to-green-600' : 'from-red-500 to-red-600'} rounded-xl p-6 text-white shadow-lg`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm opacity-90 font-medium">Saldo Líquido</span>
                <Wallet className="w-5 h-5" />
              </div>
              <p className="text-3xl font-bold mb-1">R$ {remaining.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</p>
              <p className="text-xs opacity-75">{remaining >= 0 ? 'Superávit' : 'Déficit'}</p>
            </div>

            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm opacity-90 font-medium">Taxa de Poupança</span>
                <Target className="w-5 h-5" />
              </div>
              <p className="text-3xl font-bold mb-1">{savingsRate}%</p>
              <p className="text-xs opacity-75">Meta: 20%</p>
            </div>
          </div>

          {/* Configurações */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 bg-gray-50 rounded-xl p-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Receita Mensal (R$)
              </label>
              <input
                type="number"
                value={salary}
                onChange={(e) => setSalary(parseFloat(e.target.value) || 0)}
                className="w-full px-4 py-2 border-2 border-indigo-200 rounded-lg focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Meta de Poupança Mensal (R$)
              </label>
              <input
                type="number"
                value={savingsGoal}
                onChange={(e) => setSavingsGoal(parseFloat(e.target.value) || 0)}
                className="w-full px-4 py-2 border-2 border-indigo-200 rounded-lg focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Análise Visual */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Distribuição Orçamentária</h2>
            <p className="text-sm text-gray-600 mb-4">Análise automática de alocação por categoria</p>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `R$ ${value.toLocaleString('pt-BR', {minimumFractionDigits: 2})}`} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Tendência Mensal</h2>
            <p className="text-sm text-gray-600 mb-4">Performance comparativa dos últimos meses</p>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => `R$ ${value.toLocaleString('pt-BR', {minimumFractionDigits: 2})}`} />
                <Legend />
                <Line type="monotone" dataKey="receita" stroke="#6366f1" strokeWidth={2} name="Receita" />
                <Line type="monotone" dataKey="despesa" stroke="#ef4444" strokeWidth={2} name="Despesa" />
                <Line type="monotone" dataKey="economia" stroke="#10b981" strokeWidth={2} name="Economia" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Gestão de Despesas */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Plus className="w-6 h-6 text-indigo-600" />
            Registrar Nova Despesa
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <input
              type="text"
              value={newExpense.name}
              onChange={(e) => setNewExpense({ ...newExpense, name: e.target.value })}
              className="px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-indigo-500 transition-colors"
              placeholder="Descrição da despesa"
            />
            <input
              type="number"
              value={newExpense.amount}
              onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
              className="px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-indigo-500 transition-colors"
              placeholder="Valor (R$)"
            />
            <select
              value={newExpense.category}
              onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value })}
              className="px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-indigo-500 transition-colors"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <button
              onClick={addExpense}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Adicionar
            </button>
          </div>
        </div>

        {/* Lista de Transações */}
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Histórico de Transações</h2>
          <p className="text-sm text-gray-600 mb-4">Análise detalhada de todas as movimentações</p>
          <div className="space-y-3">
            {expenses.sort((a, b) => b.amount - a.amount).map((expense) => (
              <div
                key={expense.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors border border-gray-200"
              >
                {editingId === expense.id ? (
                  <>
                    <div className="flex gap-3 flex-1">
                      <input
                        type="text"
                        value={editForm.name}
                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                        className="px-3 py-1 border-2 border-indigo-200 rounded-lg flex-1"
                      />
                      <input
                        type="number"
                        value={editForm.amount}
                        onChange={(e) => setEditForm({ ...editForm, amount: e.target.value })}
                        className="px-3 py-1 border-2 border-indigo-200 rounded-lg w-32"
                      />
                      <select
                        value={editForm.category}
                        onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                        className="px-3 py-1 border-2 border-indigo-200 rounded-lg"
                      >
                        {categories.map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>
                    <div className="flex gap-2 ml-3">
                      <button
                        onClick={() => saveEdit(expense.id)}
                        className="p-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
                      >
                        <Save className="w-4 h-4" />
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="p-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-800">{expense.name}</p>
                      <p className="text-sm text-gray-500">{expense.category}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <p className="text-xl font-bold text-indigo-600">
                        R$ {expense.amount.toLocaleString('pt-BR', {minimumFractionDigits: 2})}
                      </p>
                      <button
                        onClick={() => startEdit(expense)}
                        className="p-2 hover:bg-indigo-100 rounded-lg transition-colors"
                      >
                        <Edit2 className="w-5 h-5 text-indigo-600" />
                      </button>
                      <button
                        onClick={() => deleteExpense(expense.id)}
                        className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-5 h-5 text-red-500" />
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-gray-600 text-sm bg-white rounded-xl p-4">
          <p className="font-semibold">MinhasFinanças - Inteligência Financeira Digital</p>
          <p className="mt-1">Relatórios automatizados • Análise preditiva • Decisões estratégicas baseadas em dados</p>
        </div>
      </div>
    </div>
  );
};

export default MinhasFinancas;