import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal,
  Users,
  Mail,
  Phone,
  FileText,
  Building,
  User
} from 'lucide-react';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import ClientForm from '../components/Clients/ClientForm';
import { useClients } from '../hooks/useClients';

const Clients: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [showClientForm, setShowClientForm] = useState(false);
  
  const { clients, loading, fetchClients } = useClients();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-green-600 bg-green-100';
      case 'inactive':
        return 'text-yellow-600 bg-yellow-100';
      case 'archived':
        return 'text-gray-600 bg-gray-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'Ativo';
      case 'inactive':
        return 'Inativo';
      case 'archived':
        return 'Arquivado';
      default:
        return status;
    }
  };

  const filteredClients = clients.filter(client => {
    const matchesSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.document_number?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || client.type === filterType;
    return matchesSearch && matchesFilter;
  });

  const handleClientCreated = () => {
    fetchClients();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Clientes</h1>
          <p className="text-gray-600">Gerencie todos os seus clientes</p>
        </div>
        <Button 
          className="flex items-center space-x-2"
          onClick={() => setShowClientForm(true)}
        >
          <Plus className="w-4 h-4" />
          <span>Novo Cliente</span>
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar clientes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent w-full sm:w-80"
              />
            </div>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="all">Todos os Tipos</option>
              <option value="individual">Pessoa Física</option>
              <option value="company">Pessoa Jurídica</option>
            </select>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Filtros
            </Button>
          </div>
        </div>
      </Card>

      {/* Clients Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredClients.map((client, index) => (
          <motion.div
            key={client.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                    {client.type === 'company' ? (
                      <Building className="w-5 h-5 text-primary-600" />
                    ) : (
                      <User className="w-5 h-5 text-primary-600" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 text-sm">{client.name}</h3>
                    <p className="text-xs text-gray-500">
                      {client.type === 'company' ? 'Pessoa Jurídica' : 'Pessoa Física'}
                    </p>
                  </div>
                </div>
                <button className="text-gray-400 hover:text-gray-600">
                  <MoreHorizontal className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3">
                {client.email && (
                  <div className="flex items-center space-x-2 text-xs text-gray-500">
                    <Mail className="w-3 h-3" />
                    <span className="truncate">{client.email}</span>
                  </div>
                )}

                {client.phone && (
                  <div className="flex items-center space-x-2 text-xs text-gray-500">
                    <Phone className="w-3 h-3" />
                    <span>{client.phone}</span>
                  </div>
                )}

                {client.document_number && (
                  <div className="flex items-center space-x-2 text-xs text-gray-500">
                    <FileText className="w-3 h-3" />
                    <span>{client.type === 'company' ? 'CNPJ' : 'CPF'}: {client.document_number}</span>
                  </div>
                )}

                {client.notes && (
                  <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded">
                    {client.notes.length > 100 
                      ? `${client.notes.substring(0, 100)}...` 
                      : client.notes
                    }
                  </div>
                )}

                <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(client.status)}`}>
                    {getStatusText(client.status)}
                  </span>
                  <span className="text-xs text-gray-400">
                    {new Date(client.created_at).toLocaleDateString('pt-BR')}
                  </span>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {filteredClients.length === 0 && (
        <Card className="text-center py-12">
          <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum cliente encontrado</h3>
          <p className="text-gray-600 mb-6">
            {searchTerm || filterType !== 'all' 
              ? 'Tente ajustar os filtros de busca'
              : 'Cadastre seu primeiro cliente para começar'
            }
          </p>
          {!searchTerm && filterType === 'all' && (
            <Button onClick={() => setShowClientForm(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Cadastrar Primeiro Cliente
            </Button>
          )}
        </Card>
      )}

      {/* Client Form Modal */}
      <ClientForm
        isOpen={showClientForm}
        onClose={() => setShowClientForm(false)}
        onSuccess={handleClientCreated}
      />
    </div>
  );
};

export default Clients;
