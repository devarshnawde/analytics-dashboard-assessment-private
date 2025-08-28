# Electric Vehicle Analytics Dashboard

A modern, responsive analytics dashboard built with React and Tailwind CSS, following the Lovable design system principles.

## Features

### 🎨 Design System
- **Glassmorphism Effects**: Semi-transparent cards with backdrop blur
- **Inter Font**: Clean, modern typography for excellent readability
- **HSL Color Palette**: Consistent color system with primary teal, secondary indigo, and accent colors
- **Responsive Layout**: Mobile-first design with responsive grid systems
- **Smooth Animations**: Hover effects and transitions for enhanced interactivity

### 📊 Dashboard Components
- **Header Section**: Page title with year indicator
- **KPI Cards Grid**: 5 key performance indicators with icons and trends
- **Market Analysis Charts**: 
  - EV Adoption Growth (Area Chart)
  - EV Types Distribution (Pie Chart)
  - Popular EV Makes (Horizontal Bar Chart)
- **Interactive Elements**: Hover states, tooltips, and smooth transitions

### 🎯 Key Metrics Displayed
1. **Global EV Sales**: 24.1M units sold in 2024 (+49%)
2. **Market Leader**: Tesla with 18.2% market share
3. **BEV Dominance**: 68% Battery Electric Vehicles
4. **Charging Network**: 2.7M public chargers worldwide
5. **Market Penetration**: 15.2% global market share

## Technology Stack

- **React 19**: Latest React with modern hooks and features
- **Tailwind CSS 4**: Utility-first CSS framework
- **Recharts**: Beautiful, composable charting library
- **Lucide React**: Beautiful & consistent icon toolkit
- **Vite**: Fast build tool and development server
- **Inter Font**: Google Fonts for typography

## Design System Implementation

### Color Palette (HSL)
```css
--primary: 180 75% 35%;           /* Teal */
--secondary: 220 70% 55%;         /* Indigo */
--accent-amber: 45 95% 55%;       /* Warning/Highlight */
--accent-emerald: 155 70% 45%;    /* Success/Positive */
--background: 210 20% 98%;        /* Light gray background */
--foreground: 215 25% 15%;        /* Dark text */
```

### Glassmorphism Effects
- Semi-transparent white backgrounds
- Backdrop blur for depth
- Subtle borders and shadows
- Hover animations with lift effects

### Typography Hierarchy
- **Page Title**: `text-2xl font-bold`
- **Section Headers**: `text-lg font-semibold`
- **KPI Values**: `text-2xl font-bold`
- **KPI Labels**: `text-sm font-medium`
- **Body Text**: `text-sm`
- **Captions**: `text-xs`

## Components

### KpiCard Component

A reusable KPI card component with support for different variants and trend indicators.

#### Props Interface
```typescript
interface KpiCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  variant?: 'primary' | 'secondary' | 'amber' | 'emerald';
}
```

#### Usage Examples

**Basic KPI Card:**
```jsx
import { DollarSign } from 'lucide-react';
import KpiCard from './components/KpiCard';

<KpiCard 
  title="Revenue" 
  value="$2.4M" 
  icon={DollarSign} 
  variant="primary" 
/>
```

**With Positive Trend:**
```jsx
<KpiCard 
  title="Users" 
  value="45.2K" 
  icon={Users} 
  trend={{ value: 8.1, isPositive: true }}
  variant="secondary" 
/>
```

**With Negative Trend:**
```jsx
<KpiCard 
  title="Conversion" 
  value="3.2%" 
  icon={TrendingUp} 
  trend={{ value: 2.1, isPositive: false }}
  variant="amber" 
/>
```

#### Variants
- **primary**: Teal color scheme
- **secondary**: Indigo color scheme  
- **amber**: Warning/highlight color scheme
- **emerald**: Success/positive color scheme

## Getting Started

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm run dev
   ```

3. **Open Browser**
   Navigate to `http://localhost:5174`

## Project Structure

```
src/
├── components/
│   ├── EVDashboard.jsx          # Main dashboard component
│   ├── KpiCard.jsx              # Reusable KPI card component
│   ├── KpiCardExample.jsx       # Usage examples
│   ├── ModernDashboard.jsx      # Legacy dashboard
│   ├── SimpleChart.jsx          # Chart utilities
│   └── LoadingSpinner.jsx       # Loading component
├── utils/
│   └── dataFunctions.js         # Data processing utilities
├── App.jsx                      # Main app component
├── index.css                    # Design system styles
└── main.jsx                     # App entry point
```

## Responsive Design

The dashboard is fully responsive with the following breakpoints:
- **Mobile**: Single column layout
- **Tablet (md)**: 2-column KPI grid
- **Desktop (lg)**: 5-column KPI grid, 2-column chart layout

## Customization

### Adding New KPIs
1. Import the desired Lucide React icon
2. Add data to the `kpiData` array in `EVDashboard.jsx`
3. Choose a variant (primary, secondary, amber, emerald)
4. Optionally add trend data with `isPositive` boolean

### Modifying Charts
1. Update the data arrays (yearlyAdoptionData, evTypesData, etc.)
2. Customize chart colors using HSL variables
3. Adjust chart dimensions and styling

### Styling Changes
1. Modify CSS custom properties in `index.css`
2. Update glassmorphism effects
3. Adjust typography scale and spacing

## Performance Optimizations

- CSS custom properties for theme consistency
- Minimal animations (transform and box-shadow only)
- Efficient backdrop-filter usage
- Responsive images and optimized assets
- Tree-shakeable Lucide React icons

## Browser Support

- Modern browsers with CSS Grid and Flexbox support
- Backdrop-filter support for glassmorphism effects
- ES6+ JavaScript features

## License

This project is part of an analytics dashboard assessment.
