import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  TextInput,
  Alert,
  Modal,
  SafeAreaView,
  StatusBar
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { v4 as uuidv4 } from 'uuid';

const App = () => {
  const [activeTab, setActiveTab] = useState('booking');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedService, setSelectedService] = useState('');
  const [selectedSpecialist, setSelectedSpecialist] = useState('');
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskAssignee, setNewTaskAssignee] = useState('Anna Smith');

  // Sample data
  const specialists = {
    microblading: ['Anna Smith', 'Jessica Brown'],
    'lash-lift': ['Maria Garcia', 'Sarah Wilson'],
    'brow-lamination': ['Anna Smith', 'Maria Garcia'],
    'facial': ['Emily Davis', 'Sarah Wilson'],
    'waxing': ['Emily Davis', 'Jessica Brown']
  };

  const [bookedSlots, setBookedSlots] = useState({
    '2024-02-15': ['09:00', '11:00', '14:00'],
    '2024-02-16': ['10:00', '13:00', '15:00'],
    '2024-02-20': ['09:00', '11:30', '16:00']
  });

  const [tasks, setTasks] = useState([
    { id: uuidv4(), title: 'Client Consultation - Lisa', assignedTo: 'Anna Smith', dueDate: '2024-02-15', status: 'in-progress', type: 'appointment' },
    { id: uuidv4(), title: 'Inventory Restock', assignedTo: 'Maria Garcia', dueDate: '2024-02-16', status: 'todo', type: 'task' },
    { id: uuidv4(), title: 'Microblading - Sarah', assignedTo: 'Anna Smith', dueDate: '2024-02-15', status: 'completed', type: 'appointment' },
    { id: uuidv4(), title: 'Social Media Content', assignedTo: 'Emily Davis', dueDate: '2024-02-18', status: 'in-progress', type: 'task' }
  ]);

  // Utility functions
  const formatDate = (date) => {
    return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
  };

  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const timeSlots = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00'];

  // Calendar functions
  const renderCalendar = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = new Date(year, month, 1).getDay();
    
    const days = [];

    // Day headers
    daysOfWeek.forEach(day => {
      days.push(
        <View key={`header-${day}`} style={styles.calendarDayHeader}>
          <Text style={styles.calendarDayHeaderText}>{day}</Text>
        </View>
      );
    });

    // Empty cells for days before first day of month
    for (let i = 0; i < firstDay; i++) {
      days.push(<View key={`empty-${i}`} style={styles.calendarDay} />);
    }

    // Days of month
    for (let day = 1; day <= daysInMonth; day++) {
      const dateString = formatDate(new Date(year, month, day));
      const isSunday = new Date(year, month, day).getDay() === 0;
      const isSelected = selectedDate === dateString;
      const isBooked = bookedSlots[dateString] && bookedSlots[dateString].length > 0;

      days.push(
        <TouchableOpacity
          key={dateString}
          style={[
            styles.calendarDay,
            isSelected && styles.calendarDaySelected,
            isSunday && styles.calendarDayUnavailable
          ]}
          onPress={!isSunday ? () => setSelectedDate(dateString) : null}
          disabled={isSunday}
        >
          <Text style={[
            styles.calendarDayText,
            isSelected && styles.calendarDayTextSelected,
            isSunday && styles.calendarDayTextUnavailable
          ]}>
            {day}
          </Text>
          {isBooked && !isSunday && (
            <View style={styles.bookedDot} />
          )}
        </TouchableOpacity>
      );
    }

    return days;
  };

  const changeMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  // Booking functions
  const handleServiceChange = (service) => {
    setSelectedService(service);
    setSelectedSpecialist('');
  };

  const handleBookAppointment = () => {
    if (!selectedDate || !selectedTime || !selectedSpecialist || !selectedService || !clientName) {
      Alert.alert('Error', 'Please fill in all required fields.');
      return;
    }

    // Add to booked slots
    const newBookedSlots = { ...bookedSlots };
    if (!newBookedSlots[selectedDate]) {
      newBookedSlots[selectedDate] = [];
    }
    newBookedSlots[selectedDate].push(selectedTime);
    setBookedSlots(newBookedSlots);

    // Add as a task
    const serviceText = getServiceText(selectedService);
    const newTask = {
      id: uuidv4(),
      title: `${serviceText} - ${clientName}`,
      assignedTo: selectedSpecialist,
      dueDate: selectedDate,
      status: 'todo',
      type: 'appointment'
    };

    setTasks(prevTasks => [...prevTasks, newTask]);

    Alert.alert(
      'Booking Confirmed!',
      `Service: ${serviceText}\nSpecialist: ${selectedSpecialist}\nDate: ${selectedDate}\nTime: ${selectedTime}`
    );

    // Reset form
    setSelectedDate(null);
    setSelectedTime(null);
    setClientName('');
    setClientEmail('');
    setClientPhone('');
  };

  const getServiceText = (service) => {
    const services = {
      microblading: 'Microblading',
      'lash-lift': 'Lash Lift',
      'brow-lamination': 'Brow Lamination',
      'facial': 'Signature Facial',
      'waxing': 'Full Body Waxing'
    };
    return services[service] || service;
  };

  // Task functions
  const updateTaskStatus = (taskId, newStatus) => {
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === taskId ? { ...task, status: newStatus } : task
      )
    );
  };

  const addNewTask = () => {
    if (!newTaskTitle.trim()) {
      Alert.alert('Error', 'Please enter a task title.');
      return;
    }

    const newTask = {
      id: uuidv4(),
      title: newTaskTitle,
      assignedTo: newTaskAssignee,
      dueDate: formatDate(new Date()),
      status: 'todo',
      type: 'task'
    };

    setTasks(prevTasks => [...prevTasks, newTask]);
    setNewTaskTitle('');
    setShowTaskModal(false);
  };

  const getStatusText = (status) => {
    const statusMap = {
      'todo': 'To Do',
      'in-progress': 'In Progress',
      'completed': 'Completed'
    };
    return statusMap[status] || status;
  };

  // Render components
  const renderBookingTab = () => (
    <ScrollView style={styles.tabContent}>
      <Text style={styles.tabTitle}>Book Your Appointment</Text>
      <Text style={styles.tabSubtitle}>Select your service, specialist, and preferred time</Text>

      <View style={styles.bookingForm}>
        {/* Service Selection */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Select Service</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.serviceScroll}>
            {Object.keys(specialists).map(service => (
              <TouchableOpacity
                key={service}
                style={[
                  styles.serviceButton,
                  selectedService === service && styles.serviceButtonSelected
                ]}
                onPress={() => handleServiceChange(service)}
              >
                <Text style={[
                  styles.serviceButtonText,
                  selectedService === service && styles.serviceButtonTextSelected
                ]}>
                  {getServiceText(service)}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Specialist Selection */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Select Specialist</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {selectedService && specialists[selectedService].map(specialist => (
              <TouchableOpacity
                key={specialist}
                style={[
                  styles.specialistButton,
                  selectedSpecialist === specialist && styles.specialistButtonSelected
                ]}
                onPress={() => setSelectedSpecialist(specialist)}
              >
                <Text style={[
                  styles.specialistButtonText,
                  selectedSpecialist === specialist && styles.specialistButtonTextSelected
                ]}>
                  {specialist}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Client Information */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Your Name</Text>
          <TextInput
            style={styles.input}
            value={clientName}
            onChangeText={setClientName}
            placeholder="Enter your full name"
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            value={clientEmail}
            onChangeText={setClientEmail}
            placeholder="Enter your email"
            keyboardType="email-address"
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Phone</Text>
          <TextInput
            style={styles.input}
            value={clientPhone}
            onChangeText={setClientPhone}
            placeholder="Enter your phone number"
            keyboardType="phone-pad"
          />
        </View>

        {/* Calendar */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Select Date</Text>
          <View style={styles.calendar}>
            <View style={styles.calendarHeader}>
              <TouchableOpacity onPress={() => changeMonth(-1)} style={styles.calendarNavButton}>
                <Icon name="chevron-left" size={16} color="#3b82f6" />
              </TouchableOpacity>
              <Text style={styles.calendarMonth}>
                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
              </Text>
              <TouchableOpacity onPress={() => changeMonth(1)} style={styles.calendarNavButton}>
                <Icon name="chevron-right" size={16} color="#3b82f6" />
              </TouchableOpacity>
            </View>
            <View style={styles.calendarGrid}>
              {renderCalendar()}
            </View>
          </View>
        </View>

        {/* Time Slots */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Available Time Slots</Text>
          <View style={styles.timeSlotsGrid}>
            {timeSlots.map(time => {
              const bookedForDate = bookedSlots[selectedDate] || [];
              const isBooked = bookedForDate.includes(time);
              const isSelected = selectedTime === time;

              return (
                <TouchableOpacity
                  key={time}
                  style={[
                    styles.timeSlot,
                    isSelected && styles.timeSlotSelected,
                    isBooked && styles.timeSlotBooked
                  ]}
                  onPress={!isBooked ? () => setSelectedTime(time) : null}
                  disabled={isBooked}
                >
                  <Text style={[
                    styles.timeSlotText,
                    isSelected && styles.timeSlotTextSelected,
                    isBooked && styles.timeSlotTextBooked
                  ]}>
                    {time}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Book Button */}
        <TouchableOpacity style={styles.bookButton} onPress={handleBookAppointment}>
          <Icon name="check" size={20} color="#fff" />
          <Text style={styles.bookButtonText}>Confirm Booking</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );

  const renderTasksTab = () => (
    <ScrollView style={styles.tabContent}>
      <View style={styles.tabHeader}>
        <Text style={styles.tabTitle}>Task Management</Text>
        <TouchableOpacity style={styles.addButton} onPress={() => setShowTaskModal(true)}>
          <Icon name="plus" size={16} color="#fff" />
          <Text style={styles.addButtonText}>Add Task</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.taskList}>
        {tasks.map(task => (
          <View key={task.id} style={styles.taskItem}>
            <View style={styles.taskInfo}>
              <Text style={styles.taskTitle}>{task.title}</Text>
              <View style={styles.taskMeta}>
                <View style={styles.taskMetaItem}>
                  <Icon name="user" size={12} color="#666" />
                  <Text style={styles.taskMetaText}>{task.assignedTo}</Text>
                </View>
                <View style={styles.taskMetaItem}>
                  <Icon name="calendar" size={12} color="#666" />
                  <Text style={styles.taskMetaText}>{task.dueDate}</Text>
                </View>
                <View style={styles.taskMetaItem}>
                  <Icon name={task.type === 'appointment' ? 'calendar-check' : 'tasks'} size={12} color="#666" />
                  <Text style={styles.taskMetaText}>
                    {task.type === 'appointment' ? 'Appointment' : 'Task'}
                  </Text>
                </View>
              </View>
            </View>
            <View style={styles.taskActions}>
              <View style={[styles.taskStatus, styles[`status${task.status.replace('-', '')}`]]}>
                <Text style={styles.taskStatusText}>{getStatusText(task.status)}</Text>
              </View>
              <View style={styles.actionButtons}>
                {task.status !== 'completed' && (
                  <TouchableOpacity 
                    style={styles.actionButton}
                    onPress={() => updateTaskStatus(task.id, 'completed')}
                  >
                    <Text style={styles.actionButtonText}>Complete</Text>
                  </TouchableOpacity>
                )}
                {task.status === 'todo' && (
                  <TouchableOpacity 
                    style={styles.actionButton}
                    onPress={() => updateTaskStatus(task.id, 'in-progress')}
                  >
                    <Text style={styles.actionButtonText}>Start</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );

  const renderScheduleTab = () => (
    <ScrollView style={styles.tabContent}>
      <Text style={styles.tabTitle}>My Schedule</Text>
      <Text style={styles.tabSubtitle}>View your upcoming appointments and daily schedule</Text>

      <View style={styles.scheduleSection}>
        <Text style={styles.scheduleSectionTitle}>Today's Schedule</Text>
        {tasks
          .filter(task => task.type === 'appointment' && task.dueDate === formatDate(new Date()))
          .map(appointment => (
            <View key={appointment.id} style={styles.scheduleItem}>
              <View style={styles.scheduleItemContent}>
                <Text style={styles.scheduleItemTitle}>{appointment.title}</Text>
                <Text style={styles.scheduleItemSubtitle}>
                  {appointment.dueDate} • {appointment.assignedTo}
                </Text>
              </View>
              <View style={[styles.taskStatus, styles[`status${appointment.status.replace('-', '')}`]]}>
                <Text style={styles.taskStatusText}>{getStatusText(appointment.status)}</Text>
              </View>
            </View>
          ))
        }
      </View>
    </ScrollView>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#3b82f6" />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.logo}>
          <Icon name="spa" size={28} color="#3b82f6" />
          <Text style={styles.logoText}>Jalusi Beauty</Text>
        </View>
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabNavigation}>
        <TouchableOpacity 
          style={[styles.tabButton, activeTab === 'booking' && styles.tabButtonActive]}
          onPress={() => setActiveTab('booking')}
        >
          <Icon name="calendar-plus" size={16} color={activeTab === 'booking' ? '#fff' : '#3b82f6'} />
          <Text style={[styles.tabButtonText, activeTab === 'booking' && styles.tabButtonTextActive]}>
            Book
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.tabButton, activeTab === 'tasks' && styles.tabButtonActive]}
          onPress={() => setActiveTab('tasks')}
        >
          <Icon name="tasks" size={16} color={activeTab === 'tasks' ? '#fff' : '#3b82f6'} />
          <Text style={[styles.tabButtonText, activeTab === 'tasks' && styles.tabButtonTextActive]}>
            Tasks
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.tabButton, activeTab === 'schedule' && styles.tabButtonActive]}
          onPress={() => setActiveTab('schedule')}
        >
          <Icon name="clock" size={16} color={activeTab === 'schedule' ? '#fff' : '#3b82f6'} />
          <Text style={[styles.tabButtonText, activeTab === 'schedule' && styles.tabButtonTextActive]}>
            Schedule
          </Text>
        </TouchableOpacity>
      </View>

      {/* Tab Content */}
      {activeTab === 'booking' && renderBookingTab()}
      {activeTab === 'tasks' && renderTasksTab()}
      {activeTab === 'schedule' && renderScheduleTab()}

      {/* Add Task Modal */}
      <Modal
        visible={showTaskModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowTaskModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add New Task</Text>
            
            <TextInput
              style={styles.modalInput}
              placeholder="Task title"
              value={newTaskTitle}
              onChangeText={setNewTaskTitle}
            />
            
            <Text style={styles.modalLabel}>Assign to:</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.assigneeScroll}>
              {['Anna Smith', 'Maria Garcia', 'Emily Davis', 'Sarah Wilson', 'Jessica Brown'].map(assignee => (
                <TouchableOpacity
                  key={assignee}
                  style={[
                    styles.assigneeButton,
                    newTaskAssignee === assignee && styles.assigneeButtonSelected
                  ]}
                  onPress={() => setNewTaskAssignee(assignee)}
                >
                  <Text style={[
                    styles.assigneeButtonText,
                    newTaskAssignee === assignee && styles.assigneeButtonTextSelected
                  ]}>
                    {assignee}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.modalButtonCancel]}
                onPress={() => setShowTaskModal(false)}
              >
                <Text style={styles.modalButtonTextCancel}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalButton, styles.modalButtonConfirm]}
                onPress={addNewTask}
              >
                <Text style={styles.modalButtonTextConfirm}>Add Task</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    backgroundColor: '#fff',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  logo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  logoText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  tabNavigation: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  tabButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    gap: 8,
  },
  tabButtonActive: {
    backgroundColor: '#3b82f6',
  },
  tabButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#3b82f6',
  },
  tabButtonTextActive: {
    color: '#fff',
  },
  tabContent: {
    flex: 1,
    padding: 20,
  },
  tabHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  tabTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 8,
  },
  tabSubtitle: {
    fontSize: 16,
    color: '#64748b',
    marginBottom: 24,
  },
  bookingForm: {
    gap: 20,
  },
  formGroup: {
    gap: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
  },
  serviceScroll: {
    flexDirection: 'row',
    gap: 8,
  },
  serviceButton: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#e2e8f0',
  },
  serviceButtonSelected: {
    backgroundColor: '#3b82f6',
    borderColor: '#3b82f6',
  },
  serviceButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748b',
  },
  serviceButtonTextSelected: {
    color: '#fff',
  },
  specialistButton: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#e2e8f0',
    marginRight: 8,
  },
  specialistButtonSelected: {
    backgroundColor: '#3b82f6',
    borderColor: '#3b82f6',
  },
  specialistButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748b',
  },
  specialistButtonTextSelected: {
    color: '#fff',
  },
  input: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#e2e8f0',
    fontSize: 16,
  },
  calendar: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  calendarNavButton: {
    padding: 8,
  },
  calendarMonth: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
  },
  calendarDayHeader: {
    width: '14.28%',
    alignItems: 'center',
    padding: 8,
  },
  calendarDayHeaderText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748b',
  },
  calendarDay: {
    width: '14.28%',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#f8fafc',
  },
  calendarDaySelected: {
    backgroundColor: '#3b82f6',
  },
  calendarDayUnavailable: {
    backgroundColor: '#fef2f2',
  },
  calendarDayText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1e293b',
  },
  calendarDayTextSelected: {
    color: '#fff',
  },
  calendarDayTextUnavailable: {
    color: '#dc2626',
  },
  bookedDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#3b82f6',
    marginTop: 2,
  },
  timeSlotsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  timeSlot: {
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#e2e8f0',
    minWidth: '30%',
    alignItems: 'center',
  },
  timeSlotSelected: {
    backgroundColor: '#3b82f6',
    borderColor: '#3b82f6',
  },
  timeSlotBooked: {
    backgroundColor: '#fef2f2',
    borderColor: '#fecaca',
  },
  timeSlotText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748b',
  },
  timeSlotTextSelected: {
    color: '#fff',
  },
  timeSlotTextBooked: {
    color: '#dc2626',
  },
  bookButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#3b82f6',
    padding: 16,
    borderRadius: 8,
    marginTop: 20,
  },
  bookButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#3b82f6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  taskList: {
    gap: 12,
  },
  taskItem: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#3b82f6',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  taskInfo: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 8,
  },
  taskMeta: {
    flexDirection: 'row',
    gap: 12,
  },
  taskMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  taskMetaText: {
    fontSize: 12,
    color: '#64748b',
  },
  taskActions: {
    alignItems: 'flex-end',
    gap: 8,
  },
  taskStatus: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  taskStatusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  statustodo: {
    backgroundColor: '#fef3c7',
  },
  statusinprogress: {
    backgroundColor: '#dbeafe',
  },
  statuscompleted: {
    backgroundColor: '#d1fae5',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#3b82f6',
    borderRadius: 6,
  },
  actionButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
  },
  scheduleSection: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  scheduleSectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 12,
  },
  scheduleItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    marginBottom: 8,
  },
  scheduleItemContent: {
    flex: 1,
  },
  scheduleItemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 4,
  },
  scheduleItemSubtitle: {
    fontSize: 14,
    color: '#64748b',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 12,
    width: '100%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 16,
  },
  modalInput: {
    backgroundColor: '#f8fafc',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    fontSize: 16,
    marginBottom: 16,
  },
  modalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 8,
  },
  assigneeScroll: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 20,
  },
  assigneeButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#f8fafc',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  assigneeButtonSelected: {
    backgroundColor: '#3b82f6',
    borderColor: '#3b82f6',
  },
  assigneeButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#64748b',
  },
  assigneeButtonTextSelected: {
    color: '#fff',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  modalButtonCancel: {
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  modalButtonConfirm: {
    backgroundColor: '#3b82f6',
  },
  modalButtonTextCancel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#64748b',
  },
  modalButtonTextConfirm: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});

export default App;