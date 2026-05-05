# eCommerce Admin Dashboard - Angular

A production-ready admin dashboard for eCommerce platforms built with Angular 20, TypeScript, and Tailwind CSS.

## 📋 Project Structure

```
src/
├── app/
│   ├── components/              # Reusable UI components
│   │   ├── sidebar/             # Navigation sidebar
│   │   ├── navbar/              # Top navigation bar
│   │   ├── stat-card/           # Statistics card component
│   │   ├── loading-skeleton/    # Loading skeleton
│   │   └── modal/               # Reusable modal dialog
│   │
│   ├── pages/                   # Feature pages
│   │   ├── dashboard/           # Dashboard overview
│   │   ├── products/            # Product management
│   │   ├── orders/              # Order management
│   │   ├── users/               # User management
│   │   └── categories/          # Category management
│   │
│   ├── layouts/                 # Layout components
│   │   └── admin-layout/        # Main admin layout with sidebar + navbar
│   │
│   ├── services/
│   │   └── data.service.ts      # Mock data service for UI development
│   │
│   ├── models/
│   │   └── index.ts             # TypeScript interfaces and types
│   │
│   ├── app.routes.ts            # Application routing configuration
│   ├── app.ts                   # Root app component
│   └── app.config.ts            # Angular configuration
│
├── styles.css                   # Global styles (Tailwind + custom)
├── index.html                   # Main HTML entry point
└── main.ts                      # Application bootstrap
```

## 🚀 Features

### Dashboard Page
- **Statistics Cards**: Display key metrics (Revenue, Orders, Users, Products)
- **Revenue Chart**: Visual representation of revenue trends
- **Orders Status Chart**: Distribution of order statuses
- **Recent Orders Table**: Latest customer orders with status tracking

### Product Management
- **Product Table**: Display all products with images, prices, stock levels
- **Add/Edit Products**: Modal form for creating and editing products
- **Product Filtering**: By category, price range, rating
- **Stock Status Indicators**: Visual indicators for stock levels
- **Delete Products**: Remove products from catalog

### Order Management
- **Orders Table**: All customer orders with details
- **Order Status Updates**: Change order status (Pending → Shipped → Delivered)
- **Order Details**: View customer information and amount
- **Sorting & Filtering**: Find orders quickly

### User Management
- **Users Table**: Display all registered customers
- **User Details**: Name, email, phone, country, join date
- **User Status**: Activate/Deactivate accounts
- **User Profile**: Quick user identification with avatars

### Category Management
- **Category Grid**: Visual display of product categories
- **Add Categories**: Create new product categories
- **Edit Categories**: Update category information
- **Delete Categories**: Remove categories from system
- **Product Count**: Display number of products in each category

## 🛠️ Tech Stack

- **Framework**: Angular 20 (Latest version)
- **Language**: TypeScript 5.8+
- **Styling**: Tailwind CSS 3.4.11
- **Routing**: Angular Router
- **State Management**: Angular Signals (built-in)
- **Forms**: Angular Forms (Reactive & Template-driven)
- **HTTP**: Built-in for API integration (ready for backend)

## 📦 Components Overview

### Sidebar Component
Navigation menu with routes to all admin sections:
- Dashboard
- Products
- Orders
- Users
- Categories
- User Profile & Logout

### Navbar Component
Top navigation with:
- Search functionality
- Notifications button
- Messages button
- User profile dropdown

### Stat Card Component
Displays key metrics with:
- Title and value
- Growth percentage
- Custom icons and colors
- Responsive design

### Modal Component
Reusable dialog for:
- Adding new items
- Editing existing items
- Form validation
- Action confirmation

### Loading Skeleton Component
Placeholder loading states:
- Card skeletons
- Table row skeletons
- Text skeletons

## 🔄 Data Service

The `DataService` provides mock data for UI development:

```typescript
// Get dashboard statistics
dataService.getStats()

// Get products list
dataService.getProducts()

// Get orders
dataService.getOrders()

// Get users
dataService.getUsers()

// Get categories
dataService.getCategories()

// Get recent orders
dataService.getRecentOrders()
```

Replace these methods with actual API calls when backend is ready.

## 📊 Data Models

### User
```typescript
interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  country: string;
  createdAt: Date;
  status: 'active' | 'inactive';
}
```

### Product
```typescript
interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  image: string;
  rating: number;
  reviews: number;
}
```

### Order
```typescript
interface Order {
  id: string;
  orderId: string;
  userId: string;
  userName: string;
  amount: number;
  status: 'pending' | 'shipped' | 'delivered' | 'cancelled';
  date: Date;
  items: number;
}
```

### Category
```typescript
interface Category {
  id: string;
  name: string;
  description: string;
  productCount: number;
  createdAt: Date;
}
```

### DashboardStats
```typescript
interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  totalUsers: number;
  totalProducts: number;
  revenueGrowth: number;
  ordersGrowth: number;
  usersGrowth: number;
  productsGrowth: number;
}
```

## 🎨 Design System

### Color Scheme
- **Primary**: Blue (#3b82f6)
- **Success**: Green (#10b981)
- **Warning**: Yellow (#f59e0b)
- **Danger**: Red (#ef4444)
- **Gray**: Various shades for backgrounds and borders

### Typography
- **Headings**: Bold, larger font weights
- **Body**: Regular weight for readability
- **Labels**: Semibold for emphasis

### Spacing
- Consistent padding and margins using Tailwind utility classes
- Standard gap sizes for component layouts

## 🔌 API Integration Ready

The application is structured for easy backend integration:

1. **Replace DataService**: Update methods to call actual API endpoints
2. **Error Handling**: Add interceptors for error management
3. **Loading States**: Skeleton loaders ready for API calls
4. **Form Submissions**: Modals prepared for API requests

## 📱 Responsive Design

- **Desktop**: Full sidebar + content layout
- **Tablet**: Optimized table and card layouts
- **Mobile**: Collapsible sidebar and stacked components

## 🎯 Usage

### Running the Application
```bash
npm install
npm start
```

Access the admin dashboard at `http://localhost:4200`

### Adding a New Page
1. Create component in `src/app/pages/new-page/`
2. Add route in `src/app/app.routes.ts`
3. Add navigation link in `src/app/components/sidebar/sidebar.component.ts`

### Adding a New Component
1. Create component in `src/app/components/component-name/`
2. Import in required page components
3. Use in templates

## 🔐 Security Considerations

When implementing with real backend:
1. Add JWT authentication guards
2. Implement role-based access control
3. Add CSRF protection
4. Validate all form inputs
5. Use HTTPS for API calls
6. Implement proper error handling

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Build Options
- **Standard**: `npm run build` - Creates optimized production build
- **Watch Mode**: `npm run watch` - Builds with watch mode for development
- **Testing**: `npm test` - Run Angular tests with Jasmine/Karma

## 📚 Future Enhancements

- [ ] Dark mode toggle
- [ ] Export data to CSV/Excel
- [ ] Advanced filtering and search
- [ ] Multi-language support
- [ ] Real-time notifications
- [ ] Analytics dashboard
- [ ] Bulk operations
- [ ] User activity logs
- [ ] Two-factor authentication
- [ ] Audit trail

## 🤝 Integration with Backend

When ready to connect with NestJS backend:

1. **Update DataService** to use HttpClient:
```typescript
import { HttpClient } from '@angular/common/http';

constructor(private http: HttpClient) {}

getProducts(): Observable<Product[]> {
  return this.http.get<Product[]>('/api/products');
}
```

2. **Add HttpClientModule** to app config:
```typescript
import { HttpClientModule } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    HttpClientModule,
    // ... other providers
  ]
};
```

3. **Implement Error Handling**:
```typescript
getProducts(): Observable<Product[]> {
  return this.http.get<Product[]>('/api/products').pipe(
    catchError(error => {
      console.error('Error fetching products:', error);
      return of([]);
    })
  );
}
```

## 📖 Code Standards

- **Naming**: PascalCase for classes and components, camelCase for variables
- **Imports**: Organized and grouped by type
- **Comments**: Added where logic isn't self-evident
- **Functions**: Small, focused, single responsibility
- **Styling**: Tailwind utility classes with custom components in layers

## ⚡ Performance Features

- **Lazy Loading**: Components lazy-load data with skeleton loaders
- **Signal-based State**: Modern Angular signals for reactivity
- **OnPush Detection**: Can be added for better performance
- **Tree-shaking**: Unused code removed in production builds

## 🐛 Common Issues & Solutions

### Modal not showing?
Check if `showModal` signal is set to true and modal component is imported.

### Styling not applied?
Ensure Tailwind CSS is properly configured and build is rerun.

### Data not loading?
Verify DataService is injected correctly and subscribe to observables.

## 📞 Support

For issues or questions about the admin dashboard:
1. Check the component code comments
2. Review Angular documentation
3. Check Tailwind CSS documentation
4. Verify imports and dependencies

---

**Version**: 1.0.0  
**Last Updated**: 2024  
**License**: MIT
