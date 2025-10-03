import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  ClockIcon,
  QuestionMarkCircleIcon,
  UserGroupIcon,
  CalendarDaysIcon,
  XMarkIcon,
  WrenchScrewdriverIcon
} from '@heroicons/react/24/outline';
import { timeCapsuleAPI, mysteryBidsAPI, collectorsAPI, restorationAPI } from '../../services/api';

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('time-capsule');
  const [timeCapsules, setTimeCapsules] = useState([]);
  const [mysteryBids, setMysteryBids] = useState([]);
  const [groups, setGroups] = useState([]);
  const [events, setEvents] = useState([]);
  const [restorationExperts, setRestorationExperts] = useState([]);
  const [restorationProjects, setRestorationProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('create');
  const [selectedItem, setSelectedItem] = useState(null);
  const [formData, setFormData] = useState({});

  const tabs = [
    { id: 'time-capsule', name: 'Time Capsule', icon: ClockIcon },
    { id: 'mystery-bids', name: 'Mystery Bids', icon: QuestionMarkCircleIcon },
    { id: 'groups', name: 'Groups', icon: UserGroupIcon },
    { id: 'events', name: 'Events', icon: CalendarDaysIcon },
    { id: 'restoration', name: 'Restoration', icon: WrenchScrewdriverIcon }
  ];

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    try {
      setLoading(true);
      switch (activeTab) {
        case 'time-capsule':
          const tcResponse = await timeCapsuleAPI.getAll();
          setTimeCapsules(tcResponse.data.data || []);
          break;
        case 'mystery-bids':
          const mbResponse = await mysteryBidsAPI.getAll();
          setMysteryBids(mbResponse.data.data || []);
          break;
        case 'groups':
          const groupsResponse = await collectorsAPI.getGroups();
          setGroups(groupsResponse.data.data || []);
          break;
        case 'events':
          const eventsResponse = await collectorsAPI.getEvents();
          setEvents(eventsResponse.data.data || []);
          break;
        case 'restoration':
          const expertsResponse = await restorationAPI.getExperts();
          const projectsResponse = await restorationAPI.getProjects();
          setRestorationExperts(expertsResponse.data.data || []);
          setRestorationProjects(projectsResponse.data.data || []);
          break;
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setModalType('create');
    setSelectedItem(null);
    setFormData({});
    setShowModal(true);
  };

  const handleEdit = (item) => {
    setModalType('edit');
    setSelectedItem(item);
    setFormData(item);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;

    try {
      switch (activeTab) {
        case 'time-capsule':
          await timeCapsuleAPI.delete(id);
          break;
        case 'mystery-bids':
          await mysteryBidsAPI.delete(id);
          break;
        case 'groups':
          await collectorsAPI.deleteGroup(id);
          break;
        case 'events':
          await collectorsAPI.deleteEvent(id);
          break;
        case 'restoration':
          // For restoration, we need to determine if it's an expert or project
          // We'll check if the item has specialties (expert) or budget (project)
          const item = [...restorationExperts, ...restorationProjects].find(i => i._id === id);
          if (item.specialties) {
            await restorationAPI.deleteExpert(id);
          } else {
            await restorationAPI.deleteProject(id);
          }
          break;
      }
      toast.success('Item deleted successfully');
      fetchData();
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Failed to delete item');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (modalType === 'create') {
        switch (activeTab) {
          case 'time-capsule':
            await timeCapsuleAPI.create(formData);
            break;
          case 'mystery-bids':
            await mysteryBidsAPI.create(formData);
            break;
          case 'groups':
            await collectorsAPI.createGroup(formData);
            break;
          case 'events':
            await collectorsAPI.createEvent(formData);
            break;
          case 'restoration':
            if (formData.type === 'expert') {
              await restorationAPI.createExpert(formData);
            } else {
              await restorationAPI.createProject(formData);
            }
            break;
        }
        toast.success('Item created successfully');
      } else {
        switch (activeTab) {
          case 'time-capsule':
            await timeCapsuleAPI.update(selectedItem.id, formData);
            break;
          case 'mystery-bids':
            await mysteryBidsAPI.update(selectedItem.id, formData);
            break;
          case 'restoration':
            if (formData.type === 'expert') {
              await restorationAPI.updateExpert(selectedItem.id, formData);
            } else {
              await restorationAPI.updateProject(selectedItem.id, formData);
            }
            break;
          // Groups and events updates would need separate endpoints
        }
        toast.success('Item updated successfully');
      }
      
      setShowModal(false);
      fetchData();
    } catch (error) {
      console.error('Submit error:', error);
      toast.error('Failed to save item');
    }
  };

  const renderTable = () => {
    const currentData = 
      activeTab === 'time-capsule' ? timeCapsules :
      activeTab === 'mystery-bids' ? mysteryBids :
      activeTab === 'groups' ? groups :
      activeTab === 'events' ? events :
      activeTab === 'restoration' ? [...restorationExperts, ...restorationProjects] :
      [];

    return (
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {activeTab === 'time-capsule' || activeTab === 'mystery-bids' ? 'Title' : 
                 activeTab === 'restoration' ? 'Name/Title' : 'Name'}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {activeTab === 'time-capsule' ? 'Period' :
                 activeTab === 'mystery-bids' ? 'Category' :
                 activeTab === 'groups' ? 'Members' :
                 activeTab === 'events' ? 'Date' :
                 'Type/Budget'}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentData.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {item.title || item.name}
                  </div>
                  <div className="text-sm text-gray-500">
                    {item.description?.substring(0, 50)}...
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {activeTab === 'time-capsule' ? item.period :
                   activeTab === 'mystery-bids' ? item.category :
                   activeTab === 'groups' ? `${item.memberCount} members` :
                   activeTab === 'events' ? new Date(item.date).toLocaleDateString() :
                   activeTab === 'restoration' ? (
                     item.specialties ? 'Expert' : 
                     item.budget ? `$${item.budget.min}-${item.budget.max}` : 'Project'
                   ) : ''}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    item.status === 'active' ? 'bg-green-100 text-green-800' :
                    item.status === 'upcoming' ? 'bg-blue-100 text-blue-800' :
                    item.status === 'ended' ? 'bg-gray-100 text-gray-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {item.status || 'active'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                  <button
                    onClick={() => handleEdit(item)}
                    className="text-indigo-600 hover:text-indigo-900 p-1"
                  >
                    <PencilIcon className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="text-red-600 hover:text-red-900 p-1"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const renderForm = () => {
    if (activeTab === 'time-capsule') {
      return (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              type="text"
              value={formData.title || ''}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Era</label>
            <input
              type="text"
              value={formData.era || ''}
              onChange={(e) => setFormData({...formData, era: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Period</label>
            <select
              value={formData.period || ''}
              onChange={(e) => setFormData({...formData, period: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            >
              <option value="">Select Period</option>
              <option value="ancient">Ancient Era</option>
              <option value="medieval">Medieval</option>
              <option value="renaissance">Renaissance</option>
              <option value="industrial">Industrial Age</option>
              <option value="modern">Modern Era</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={formData.description || ''}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              rows={3}
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Starting Bid</label>
              <input
                type="number"
                value={formData.startingBid || ''}
                onChange={(e) => setFormData({...formData, startingBid: Number(e.target.value)})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
              <input
                type="datetime-local"
                value={formData.endTime ? new Date(formData.endTime).toISOString().slice(0, 16) : ''}
                onChange={(e) => setFormData({...formData, endTime: new Date(e.target.value)})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>
          </div>
        </div>
      );
    }

    if (activeTab === 'restoration') {
      return (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
            <select
              value={formData.type || 'expert'}
              onChange={(e) => setFormData({...formData, type: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            >
              <option value="expert">Expert</option>
              <option value="project">Project</option>
            </select>
          </div>
          
          {formData.type === 'expert' ? (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  value={formData.name || ''}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  value={formData.title || ''}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Specialties (comma-separated)</label>
                <input
                  type="text"
                  value={formData.specialties ? formData.specialties.join(', ') : ''}
                  onChange={(e) => setFormData({...formData, specialties: e.target.value.split(', ').filter(s => s.trim())})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Experience (years)</label>
                <input
                  type="number"
                  value={formData.experience || ''}
                  onChange={(e) => setFormData({...formData, experience: Number(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <input
                  type="text"
                  value={formData.location || ''}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Min Rate</label>
                  <input
                    type="number"
                    value={formData.hourlyRate?.min || ''}
                    onChange={(e) => setFormData({
                      ...formData, 
                      hourlyRate: {...(formData.hourlyRate || {}), min: Number(e.target.value)}
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Max Rate</label>
                  <input
                    type="number"
                    value={formData.hourlyRate?.max || ''}
                    onChange={(e) => setFormData({
                      ...formData, 
                      hourlyRate: {...(formData.hourlyRate || {}), max: Number(e.target.value)}
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
                  <input
                    type="text"
                    value={formData.hourlyRate?.currency || 'USD'}
                    onChange={(e) => setFormData({
                      ...formData, 
                      hourlyRate: {...(formData.hourlyRate || {}), currency: e.target.value}
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>
              </div>
            </>
          ) : (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  value={formData.title || ''}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={formData.description || ''}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  rows={3}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  value={formData.category || ''}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                >
                  <option value="">Select Category</option>
                  <option value="Furniture">Furniture</option>
                  <option value="Artwork">Artwork</option>
                  <option value="Books">Books</option>
                  <option value="Jewelry">Jewelry</option>
                  <option value="Decorative">Decorative</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <input
                  type="text"
                  value={formData.location || ''}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Min Budget</label>
                  <input
                    type="number"
                    value={formData.budget?.min || ''}
                    onChange={(e) => setFormData({
                      ...formData, 
                      budget: {...(formData.budget || {}), min: Number(e.target.value)}
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Max Budget</label>
                  <input
                    type="number"
                    value={formData.budget?.max || ''}
                    onChange={(e) => setFormData({
                      ...formData, 
                      budget: {...(formData.budget || {}), max: Number(e.target.value)}
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
                  <input
                    type="text"
                    value={formData.budget?.currency || 'USD'}
                    onChange={(e) => setFormData({
                      ...formData, 
                      budget: {...(formData.budget || {}), currency: e.target.value}
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>
              </div>
            </>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Bio/Additional Info</label>
            <textarea
              value={formData.bio || ''}
              onChange={(e) => setFormData({...formData, bio: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              rows={3}
            />
          </div>
        </div>
      );
    }

    return <div>Form for {activeTab}</div>;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Panel</h1>
          <p className="text-gray-600 mt-2">Manage Time Capsule, Mystery Bids, Groups, Events, and Restoration</p>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                    activeTab === tab.id
                      ? 'border-purple-500 text-purple-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <tab.icon className="w-5 h-5" />
                  <span>{tab.name}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Action Bar */}
        <div className="mb-6 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">
            {tabs.find(t => t.id === activeTab)?.name}
          </h2>
          <button
            onClick={handleCreate}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 flex items-center space-x-2"
          >
            <PlusIcon className="w-5 h-5" />
            <span>Add New</span>
          </button>
        </div>

        {/* Content */}
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600 mx-auto"></div>
          </div>
        ) : (
          renderTable()
        )}

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-96 overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">
                  {modalType === 'create' ? 'Create' : 'Edit'} {tabs.find(t => t.id === activeTab)?.name}
                </h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>
              
              <form onSubmit={handleSubmit}>
                {renderForm()}
                
                <div className="flex space-x-3 mt-6">
                  <button
                    type="submit"
                    className="flex-1 bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700"
                  >
                    {modalType === 'create' ? 'Create' : 'Update'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;