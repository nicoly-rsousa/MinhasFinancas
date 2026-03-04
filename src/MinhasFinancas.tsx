import React, { useState, useEffect, type ChangeEvent } from 'react';
import { 
    PieChart, Pie, Cell, ResponsiveContainer, Tooltip, 
    LineChart, Line, XAxis, YAxis, CartesianGrid, Legend 
} from 'recharts';
import { 
    Wallet, TrendingUp, DollarSign, Plus, Trash2, Edit2, 
    Save, X, AlertCircle, CheckCircle, Download, BarChart3, Target, Brain, 
    type LucideIcon 
} from 'lucide-react';

interface IExpense {
  id: number;
  name: string;
  amount: number;
  category: string;
  date: string;
}

interface INewExpense {
  name: string;
  amount: string; 
  category: string;
}

interface IEditForm {
  name: string;
  amount: string; 
  category: string;
}

type InsightColor = 'red' | 'orange' | 'green' | 'blue';

interface IInsight {
  type: 'alert' | 'warning' | 'success' | 'info';
  title: string;
  message: string;
  icon: LucideIcon; 
  color: InsightColor;
}

interface ICategoryData {
    name: string;
    value: number;
    [key: string]: any; 
}

interface IMonthlyData {
    month: string;
    receita: number;
    despesa: number;
    economia: number;
    [key: string]: any; 
}

const MinhasFinancas: React.FC = () => { 

  const [salary, setSalary] = useState<number>(() => {
    const savedSalary = localStorage.getItem('minhasFinancas-salary');
    return savedSalary ? JSON.parse(savedSalary) : 5000;
  });

  const [expenses, setExpenses] = useState<IExpense[]>(() => {
    const savedExpenses = localStorage.getItem('minhasFinancas-expenses');
    return savedExpenses ? JSON.parse(savedExpenses) : [
      { id: 1, name: 'Aluguel', amount: 1500, category: 'Moradia', date: '2025-11-01' },
      { id: 2, name: 'Alimentação', amount: 800, category: 'Alimentação', date: '2025-11-05' },
      { id: 3, name: 'Transporte', amount: 400, category: 'Transporte', date: '2025-11-03' },
      { id: 4, name: 'Lazer', amount: 300, category: 'Lazer', date: '2025-11-02' }
    ];
  });

  const [newExpense, setNewExpense] = useState<INewExpense>({ name: '', amount: '', category: 'Moradia' });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<IEditForm>({ name: '', amount: '', category: '' });
  
  const [savingsGoal, setSavingsGoal] = useState<number>(() => {
    const savedGoal = localStorage.getItem('minhasFinancas-savingsGoal');
    return savedGoal ? JSON.parse(savedGoal) : 1000;
  });

  useEffect(() => {
    localStorage.setItem('minhasFinancas-salary', JSON.stringify(salary));
  }, [salary]);

  useEffect(() => {
    localStorage.setItem('minhasFinancas-expenses', JSON.stringify(expenses));
  }, [expenses]);

  useEffect(() => {
    localStorage.setItem('minhasFinancas-savingsGoal', JSON.stringify(savingsGoal));
  }, [savingsGoal]);

  const categories: string[] = ['Moradia', 'Alimentação', 'Transporte', 'Saúde', 'Lazer', 'Educação', 'Investimentos', 'Outros'];
  const COLORS: string[] = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6', '#14b8a6', '#ef4444'];

  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const remaining = salary - totalExpenses;
  const percentageUsed = salary > 0 ? ((totalExpenses / salary) * 100).toFixed(1) : "0.0";
  const savingsRate = salary > 0 ? ((remaining / salary) * 100).toFixed(1) : "0.0";

  const categoryData: ICategoryData[] = categories.map(cat => {
    const total = expenses
      .filter(exp => exp.category === cat)
      .reduce((sum, exp) => sum + exp.amount, 0);
    return { name: cat, value: total };
  }).filter(item => item.value > 0);

  const monthlyTrend: IMonthlyData[] = [
    { month: 'Ago', receita: 5000, despesa: 4200, economia: 800 },
    { month: 'Set', receita: 5000, despesa: 3800, economia: 1200 },
    { month: 'Out', receita: 5000, despesa: 3500, economia: 1500 },
    { month: 'Nov', receita: salary, despesa: totalExpenses, economia: remaining }
  ];

  const generateInsights = (): IInsight[] => {
    const insights: IInsight[] = [];
    
    if (remaining < 0) {
      insights.push({ type: 'alert', title: 'Atenção: Déficit Orçamentário', message: `Suas despesas excedem sua receita em R$ ${Math.abs(remaining).toFixed(2)}.`, icon: AlertCircle, color: 'red' });
    } else if (remaining < salary * 0.1) {
      insights.push({ type: 'warning', title: 'Taxa de Poupança Abaixo do Ideal', message: `Você está economizando ${savingsRate}%. Especialistas recomendam pelo menos 20%.`, icon: AlertCircle, color: 'orange' });
    } else if (remaining >= savingsGoal) {
      insights.push({ type: 'success', title: 'Meta de Poupança Alcançada', message: `Excelente! Você atingiu sua meta de economia de R$ ${savingsGoal.toFixed(2)}.`, icon: CheckCircle, color: 'green' });
    }

    if (expenses.length > 0) {
      const biggestExpense = expenses.reduce((max, exp) => exp.amount > max.amount ? exp : max, expenses[0]);
      if (biggestExpense && biggestExpense.amount > salary * 0.3) {
        insights.push({ type: 'info', title: 'Concentração de Despesas', message: `${biggestExpense.category} representa ${((biggestExpense.amount / totalExpenses) * 100).toFixed(1)}% do seu orçamento.`, icon: BarChart3, color: 'blue' });
      }
    }
    return insights;
  };

  const addExpense = () => {
    const amount = parseFloat(newExpense.amount);
    if (newExpense.name && !isNaN(amount) && amount > 0) {
      const expenseToAdd: IExpense = {
        id: Date.now(),
        name: newExpense.name,
        amount: amount,
        category: newExpense.category,
        date: new Date().toISOString().split('T')[0]
      };
      setExpenses([...expenses, expenseToAdd]);
      setNewExpense({ name: '', amount: '', category: 'Moradia' });
    } else {
        alert("Por favor, preencha uma descrição válida e um valor numérico positivo.");
    }
  };

  const deleteExpense = (id: number) => {
    setExpenses(expenses.filter(exp => exp.id !== id));
  };

  const startEdit = (expense: IExpense) => {
    setEditingId(expense.id);
    setEditForm({ 
      name: expense.name, 
      amount: String(expense.amount),
      category: expense.category 
    });
  };

  const saveEdit = (id: number) => {
    const amount = parseFloat(editForm.amount);
    if (editForm.name && !isNaN(amount) && amount > 0) {
        setExpenses(expenses.map(exp => 
          exp.id === id ? { 
            ...exp, 
            name: editForm.name, 
            amount: amount,
            category: editForm.category 
          } : exp
        ));
        setEditingId(null);
    } else {
        alert("Por favor, preencha uma descrição válida e um valor numérico positivo.");
    }
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
  `${cat.name}: R$ ${cat.value.toFixed(2)} (${totalExpenses > 0 ? ((cat.value/totalExpenses)*100).toFixed(1) : 0}%)`
).join('\n')}

DETALHAMENTO DE DESPESAS
${expenses.map(exp => 
  `${exp.name} - ${exp.category}: R$ ${exp.amount.toFixed(2)}`
).join('\n')}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    `;
    
    const blob = new Blob([report], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `relatorio-financeiro-${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleSalaryChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSalary(parseFloat(e.target.value) || 0);
  };

  const handleGoalChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSavingsGoal(parseFloat(e.target.value) || 0);
  };

  const handleNewExpenseChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewExpense(prev => ({ ...prev, [name]: value }));
  };

  const handleEditFormChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditForm(prev => ({ ...prev, [name]: value }));
  };

  // CORREÇÃO: função separada para o label do Pie
  const renderPieLabel = (props: any) => {
    const { name, percent } = props;
    return `${name} ${(percent * 100).toFixed(0)}%`;
  };

  const insights = generateInsights();

  return (
<div className="min-h-screen w-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <header className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-2xl">
        <div className="w-full px-4 md:px-6 py-6">
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

      <div className="w-full p-4 md:p-6">
        {insights.length > 0 && (
          <div className="mb-6 space-y-3">
            {insights.map((insight, idx) => {
              const Icon = insight.icon;
              const colorMap: Record<InsightColor, string> = {
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

        <div className="bg-white rounded-2xl shadow-xl p-4 md:p-8 mb-6">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Dashboard de Performance</h2>
            <p className="text-gray-600 text-sm">Análise automatizada em tempo real</p>
          </div>

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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 bg-gray-50 rounded-xl p-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Receita Mensal (R$)
              </label>
              <input
                type="number"
                value={salary}
                onChange={handleSalaryChange}
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
                onChange={handleGoalChange}
                className="w-full px-4 py-2 border-2 border-indigo-200 rounded-lg focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>
          </div>
        </div>

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
                  label={renderPieLabel}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((_entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => `R$ ${value.toLocaleString('pt-BR', {minimumFractionDigits: 2})}`} />
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
                <Tooltip formatter={(value: number) => `R$ ${value.toLocaleString('pt-BR', {minimumFractionDigits: 2})}`} />
                <Legend />
                <Line type="monotone" dataKey="receita" stroke="#6366f1" strokeWidth={2} name="Receita" />
                <Line type="monotone" dataKey="despesa" stroke="#ef4444" strokeWidth={2} name="Despesa" />
                <Line type="monotone" dataKey="economia" stroke="#10b981" strokeWidth={2} name="Economia" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Plus className="w-6 h-6 text-indigo-600" />
            Registrar Nova Despesa
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <input
              type="text"
              name="name"
              value={newExpense.name}
              onChange={handleNewExpenseChange}
              className="px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-indigo-500 transition-colors"
              placeholder="Descrição da despesa"
            />
            <input
              type="number"
              name="amount"
              value={newExpense.amount}
              onChange={handleNewExpenseChange}
              className="px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-indigo-500 transition-colors"
              placeholder="Valor (R$)"
            />
            <select
              name="category"
              value={newExpense.category}
              onChange={handleNewExpenseChange}
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

        <div className="bg-white rounded-2xl shadow-xl p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Histórico de Transações</h2>
          <p className="text-sm text-gray-600 mb-4">Análise detalhada de todas as movimentações</p>
          <div className="space-y-3">
            {expenses.sort((a, b) => b.amount - a.amount).map((expense) => (
              <div
                key={expense.id}
                className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors border border-gray-200"
              >
                {editingId === expense.id ? (
                  <>
                    <div className="flex flex-col md:flex-row gap-3 flex-1 w-full mb-3 md:mb-0">
                      <input
                        type="text"
                        name="name"
                        value={editForm.name}
                        onChange={handleEditFormChange}
                        className="px-3 py-1 border-2 border-indigo-200 rounded-lg flex-1"
                      />
                      <input
                        type="number"
                        name="amount"
                        value={editForm.amount}
                        onChange={handleEditFormChange}
                        className="px-3 py-1 border-2 border-indigo-200 rounded-lg w-full md:w-32"
                      />
                      <select
                        name="category"
                        value={editForm.category}
                        onChange={handleEditFormChange}
                        className="px-3 py-1 border-2 border-indigo-200 rounded-lg w-full md:w-auto"
                      >
                        {categories.map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>
                    <div className="flex gap-2 ml-auto">
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
                    <div className="flex-1 mb-3 md:mb-0">
                      <p className="font-semibold text-gray-800">{expense.name}</p>
                      <p className="text-sm text-gray-500">{expense.category}</p>
                    </div>
                    <div className="flex items-center gap-4 w-full md:w-auto">
                      <p className="text-xl font-bold text-indigo-600 flex-1">
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

        <div className="mt-8 text-center text-gray-600 text-sm bg-white rounded-xl p-4">
          <p className="font-semibold">MinhasFinanças - Inteligência Financeira Digital</p>
          <p className="mt-1">Relatórios automatizados • Análise preditiva • Decisões estratégicas baseadas em dados</p>
        </div>
      </div>
    </div>
  );
};

export default MinhasFinancas;