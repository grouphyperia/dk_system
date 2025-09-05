import React from 'react';
import { motion } from 'framer-motion';
import { 
  Briefcase, 
  Users, 
  FileText, 
  TrendingUp, 
  Clock, 
  DollarSign,
  AlertTriangle,
  CheckCircle,
  Plus
} from 'lucide-react';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import { useAuth } from '../contexts/AuthContext';
import { useStats } from '../hooks/useStats';
import { useCases } from '../hooks/useCases';
import { Link } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const { profile, currentOrganization } = useAuth();
  const { stats, loading: statsLoading } = useStats();
  const { cases, loading: casesLoading } = useCases();

  // Get recent cases (last 5)
  const recentCases = cases.slice(0, 5);

  // Get upcoming tasks (mock data for now)
  const upcomingTasks = [
    {
      id: 1,
      task: 'Audiência - Caso Silva',
      time: '14:00',
      date: '2025-01-30',
      priority: 'high',
    },
    {
      id: 2,
      task: 'Entrega de petição',
      time: '16:30',
      date: '2025-01-30',
      priority: 'medium',
    },
    {
      id: 3,
      task: 'Reunião com cliente',
      time: '10:00',
      date: '2025-01-31',
      priority: 'low',
    },
  ];

  const statsCards = [
    {
      name: 'Casos Ativos',
      value: stats?.activeCases.toString() || '0',
      change: `+${stats?.casesChange || 0}`,
      changeType: 'increase',
      icon: Briefcase,
    },
    {
      name: 'Clientes',
      value: stats?.totalClients.toString() || '0',
      change: `+${stats?.clientsChange || 0}`,
      changeType: 'increase',
      icon: Users,
    },
    {
      name: 'Documentos',
      value: stats?.totalDocuments.toString() || '0',
      change: `+${stats?.documentsChange || 0}`,
      changeType: 'increase',
      icon: FileText,
    },
    {
      name: 'Receita Estimada',
      value: stats ? new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        maximumFractionDigits: 0,
      }).format(stats.monthlyRevenue) : 'R$ 0',
      change: `+${stats?.revenueChange || 0}%`,
      changeType: 'increase',
      icon: DollarSign,
    },
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'text-red-700 bg-red-100';
      case 'high':
        return 'text-red-600 bg-red-50';
      case 'medium':
        return 'text-yellow-600 bg-yellow-50';
      case 'low':
        return 'text-green-600 bg-green-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'in_progress':
        return 'text-blue-600 bg-blue-100';
      case 'pending':
        return 'text-yellow-600 bg-yellow-100';
      case 'closed':
        return 'text-gray-600 bg-gray-100';
      case 'open':
        return 'text-green-600 bg-green-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'open':
        return 'Aberto';
      case 'in_progress':
        return 'Em Andamento';
      case 'pending':
        return 'Pendente';
      case 'closed':
        return 'Fechado';
      default:
        return status;
    }
  };

  if (statsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Bem-vindo, {profile?.full_name?.split(' ')[0]}!
          </h1>
          <p className="text-gray-600">
            Aqui está um resumo das atividades do {currentOrganization?.organization?.name}
          </p>
        </div>
        <Link to="/cases">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Novo Caso
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat, index) => (
          <motion.div
            key={stat.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card>
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center">
                    <stat.icon className="w-5 h-5 text-primary-600" />
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      {stat.name}
                    </dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-900">
                        {stat.value}
                      </div>
                      <div className={`ml-2 flex items-baseline text-sm font-semibold ${
                        stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {stat.change}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Cases */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-medium text-gray-900">Casos Recentes</h3>
              <Link to="/cases" className="text-primary-600 hover:text-primary-500 text-sm font-medium">
                Ver todos
              </Link>
            </div>
            
            {casesLoading ? (
              <div className="flex items-center justify-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
              </div>
            ) : recentCases.length > 0 ? (
              <div className="space-y-4">
                {recentCases.map((case_) => (
                  <div key={case_.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-gray-900">{case_.title}</h4>
                      <p className="text-sm text-gray-500">Cliente: {case_.client?.name}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        Número: {case_.case_number}
                      </p>
                    </div>
                    <div className="flex flex-col items-end space-y-2">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(case_.status)}`}>
                        {getStatusText(case_.status)}
                      </span>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(case_.priority)}`}>
                        {case_.priority === 'urgent' ? 'Urgente' : 
                         case_.priority === 'high' ? 'Alta' : 
                         case_.priority === 'medium' ? 'Média' : 'Baixa'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Nenhum caso encontrado</p>
                <Link to="/cases" className="text-primary-600 hover:text-primary-500 text-sm font-medium">
                  Criar primeiro caso
                </Link>
              </div>
            )}
          </Card>
        </motion.div>

        {/* Upcoming Tasks */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-medium text-gray-900">Próximas Tarefas</h3>
              <Clock className="w-5 h-5 text-gray-400" />
            </div>
            <div className="space-y-4">
              {upcomingTasks.map((task) => (
                <div key={task.id} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                  <div className={`w-3 h-3 rounded-full ${
                    task.priority === 'high' ? 'bg-red-500' : 
                    task.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                  }`} />
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-gray-900">{task.task}</h4>
                    <p className="text-xs text-gray-500">{task.date} às {task.time}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    {task.priority === 'high' && (
                      <AlertTriangle className="w-4 h-4 text-red-500" />
                    )}
                    <CheckCircle className="w-4 h-4 text-gray-400" />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
