# Navigation System Guide

## Overview
This guide explains the dual navigation system implemented for the Battery Charging Station Monitor and Automated Battery Swapping System.

## Architecture

### Navigation Structure
```
├── Navbar (Top Navigation)
│   ├── Battery Monitoring (Default - /)
│   └── Rover Monitoring (/rover-monitoring)
```

### Components

#### 1. Navbar Component (`src/components/Navbar.jsx`)
**Purpose**: Main navigation bar displayed at the top of all pages

**Features**:
- Logo with system title
- Navigation links with active state highlighting
- Connection status indicator
- Last update timestamp

**Props**:
- `connected` (boolean): Connection status
- `lastUpdate` (Date): Timestamp of last data update

**Customization**:
```jsx
// To add a new navigation link:
<NavLink
  to="/your-new-route"
  className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
>
  <YourIcon size={20} />
  <span>Your Page Name</span>
</NavLink>
```

#### 2. Battery Monitoring Component (`src/components/BatteryMonitoring.jsx`)
**Purpose**: Default view showing battery charging station data

**Features**:
- Battery slot cards with real-time data
- Charging graphs for selected battery
- Alerts panel

**Data Source**: `MockDataStream` from `src/services/mockData.js`

**To Use Real Data**:
Replace the MockDataStream in useEffect with your API call:
```jsx
useEffect(() => {
  const fetchData = async () => {
    const response = await fetch('your-api-endpoint');
    const data = await response.json();
    setBatteryData(data);
  };

  const interval = setInterval(fetchData, 2000);
  return () => clearInterval(interval);
}, []);
```

#### 3. Rover Monitoring Component (`src/components/RoverMonitoring.jsx`)
**Purpose**: Display and manage autonomous rover fleet

**Features**:
- Statistics cards (Active, Charging, Idle, Maintenance)
- Filter buttons for quick status filtering
- Sortable data table
- Real-time updates (every 5 seconds)

**Table Columns**:
- Rover ID
- Name
- Status (with color-coded badges)
- Battery Level (with progress bar)
- Location
- Speed (km/h)
- Temperature (°C)
- Distance (km)
- Mission Status
- Last Update

**Customizing the Table**:

Add a new column:
```jsx
// In the <thead>:
<th onClick={() => requestSort('newField')}>
  New Field
  {sortConfig.key === 'newField' && (
    <span className="sort-indicator">
      {sortConfig.direction === 'asc' ? ' ↑' : ' ↓'}
    </span>
  )}
</th>

// In the <tbody>:
<td>{rover.newField}</td>
```

**To Use Real Data**:
```jsx
useEffect(() => {
  const fetchRoverData = async () => {
    const response = await fetch('your-rover-api-endpoint');
    const data = await response.json();
    setRoverData(data);
  };

  fetchRoverData();
  const interval = setInterval(fetchRoverData, 5000);
  return () => clearInterval(interval);
}, []);
```

## Routing

### Route Configuration (`src/App.jsx`)
```jsx
<Routes>
  <Route path="/" element={<BatteryMonitoring />} />
  <Route path="/rover-monitoring" element={<RoverMonitoring />} />
</Routes>
```

### Adding New Routes
```jsx
// 1. Import your new component
import YourNewComponent from './components/YourNewComponent';

// 2. Add route in App.jsx
<Route path="/your-route" element={<YourNewComponent />} />

// 3. Add navigation link in Navbar.jsx
<NavLink to="/your-route">
  <Icon size={20} />
  <span>Your Page</span>
</NavLink>
```

## Styling

### Design System
- **Primary Color**: Green gradient (#059669 → #10b981 → #34d399)
- **Glass Effect**: backdrop-filter with blur
- **Animations**: Smooth transitions (0.3s ease)
- **Shadows**: Layered with RGBA for depth

### CSS Organization
Each component has its own CSS file:
- `Navbar.css` - Navigation styles
- `BatteryMonitoring.css` - Battery view styles
- `RoverMonitoring.css` - Rover view styles
- `App.css` - Global styles and background

### Common Style Patterns
```css
/* Glass morphism card */
.your-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(0, 0, 0, 0.05);
}

/* Gradient button */
.your-button {
  background: linear-gradient(135deg, #059669 0%, #10b981 50%, #34d399 100%);
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0.625rem 1.5rem;
}

/* Status badge */
.your-status {
  padding: 0.375rem 0.875rem;
  border-radius: 6px;
  font-weight: 600;
  font-size: 0.8rem;
  text-transform: capitalize;
}
```

## Responsive Design

### Breakpoints
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

### Mobile Optimizations
- Navbar collapses to icon-only on small screens
- Tables scroll horizontally
- Cards stack vertically
- Reduced padding and font sizes

## Data Updates

### Current Implementation
Both views use mock data generators that simulate real-time updates:
- Battery data: Updates every 2 seconds
- Rover data: Updates every 5 seconds

### Integration with Real APIs

#### Battery Monitoring
Edit `src/components/BatteryMonitoring.jsx`:
```jsx
useEffect(() => {
  const fetchBatteryData = async () => {
    try {
      const response = await fetch('https://your-api/battery-data');
      const data = await response.json();
      setBatteryData(data);
    } catch (error) {
      console.error('Error fetching battery data:', error);
    }
  };

  fetchBatteryData();
  const interval = setInterval(fetchBatteryData, 2000);
  return () => clearInterval(interval);
}, []);
```

#### Rover Monitoring
Edit `src/components/RoverMonitoring.jsx`:
```jsx
useEffect(() => {
  const fetchRoverData = async () => {
    try {
      const response = await fetch('https://your-api/rover-data');
      const data = await response.json();
      setRoverData(data);
    } catch (error) {
      console.error('Error fetching rover data:', error);
    }
  };

  fetchRoverData();
  const interval = setInterval(fetchRoverData, 5000);
  return () => clearInterval(interval);
}, []);
```

## Development

### Running the App
```bash
npm run dev        # Start development server (http://localhost:5173)
npm run build      # Build for production
npm run preview    # Preview production build
npm run lint       # Run ESLint
```

### File Structure
```
src/
├── App.jsx                     # Main app with routing
├── App.css                     # Global styles
├── main.jsx                    # React entry point
├── index.css                   # Global CSS reset
├── components/
│   ├── Navbar.jsx              # Navigation bar
│   ├── Navbar.css
│   ├── BatteryMonitoring.jsx   # Battery view
│   ├── BatteryMonitoring.css
│   ├── RoverMonitoring.jsx     # Rover view
│   ├── RoverMonitoring.css
│   ├── BatteryCard.jsx         # Battery slot card
│   ├── BatteryCard.css
│   ├── ChargingGraphs.jsx      # Real-time graphs
│   ├── ChargingGraphs.css
│   ├── AlertsPanel.jsx         # Alerts display
│   ├── AlertsPanel.css
│   ├── Header.jsx              # Legacy header (can be removed)
│   └── Header.css
└── services/
    └── mockData.js             # Mock data generators
```

## Best Practices

### 1. Component Organization
- One component per file
- Separate CSS files for each component
- Use meaningful component and variable names

### 2. State Management
- Use `useState` for local state
- Use `useEffect` for side effects (data fetching)
- Use `useMemo` for expensive calculations
- Use `useCallback` for event handlers

### 3. Performance
- Memoize components with `React.memo` when needed
- Use `useMemo` and `useCallback` to prevent unnecessary re-renders
- Lazy load routes if the app grows larger

### 4. Code Maintainability
- Keep components small and focused
- Extract reusable logic into custom hooks
- Comment complex logic
- Use consistent naming conventions

### 5. Styling
- Follow the established design system
- Use CSS variables for colors if needed
- Keep responsive design in mind
- Test on different screen sizes

## Common Tasks

### Update Navigation Colors
Edit `src/components/Navbar.css`:
```css
.navbar {
  background: linear-gradient(135deg, #your-color-1 0%, #your-color-2 50%, #your-color-3 100%);
}
```

### Add a New Filter in Rover Monitoring
Edit `src/components/RoverMonitoring.jsx`:
```jsx
<button
  className={filterStatus === 'your-status' ? 'filter-btn active' : 'filter-btn'}
  onClick={() => setFilterStatus('your-status')}
>
  Your Status Label
</button>
```

### Change Update Frequency
Edit the interval value in `useEffect`:
```jsx
const interval = setInterval(() => {
  // Update logic
}, 3000); // Change to your desired milliseconds
```

### Add Custom Icons
```bash
# All icons come from lucide-react
# Browse available icons: https://lucide.dev/icons/

# Import in your component:
import { YourIconName } from 'lucide-react';

# Use in JSX:
<YourIconName size={20} />
```

## Troubleshooting

### Navigation not working
- Check that React Router is installed: `npm list react-router-dom`
- Verify `<Router>` wraps your app in `App.jsx`
- Check route paths match NavLink `to` props

### Styles not applying
- Clear browser cache
- Check CSS file is imported in component
- Verify class names match between JSX and CSS
- Check for CSS specificity conflicts

### Data not updating
- Check console for errors
- Verify API endpoint is accessible
- Check network tab for failed requests
- Ensure intervals are cleared on unmount

### Build errors
- Run `npm run build` to see detailed errors
- Check all imports are correct
- Verify all dependencies are installed
- Clear `node_modules` and reinstall if needed

## Support

For questions or issues:
1. Check this guide
2. Review component files and comments
3. Check React Router documentation: https://reactrouter.com/
4. Check Vite documentation: https://vitejs.dev/

---

**Last Updated**: 2025-12-12
**React Version**: 19.2.0
**Vite Version**: 7.2.7
**React Router Version**: 6.x
