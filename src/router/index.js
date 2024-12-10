import { createRouter, createWebHistory } from 'vue-router';

// Create the router instance with route configurations
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Login',
      component: () => import('../components/HomeComponent.vue'),
      meta: { requiresAuth: false }
    },
    {
      path: '/test',
      name: 'test',
      component: () => import('../components/testComponent.vue'),
      meta: { requiresAuth: false }
    },
    {
      path: '/forgotpassword',
      name: 'forgotpassword',
      component: () => import('../components/ForgotPasswordComponent.vue'),
      meta: { requiresAuth: false }
    },
    // {
    //   path: '/',
    //   name: 'Login',
    //   component: () => import('../views/LoginView.vue'),
    //   meta: { requiresAuth: false }
    // },
    {
      path: '/createaccount',
      name: 'CreateAccount',
      component: () => import('../views/RegistrationView.vue'),
      meta: { requiresAuth: false }
    },
    {
      path: '/dashboard',
      name: 'BuyerDashboard',
      component: () => import('../components/buyerComponents/BuyerHomepageComponent.vue'),
      meta: { requiresAuth: 'buyer' }
    },
    {
      path: '/cart',
      name: 'Cart',
      component: () => import('../components/buyerComponents/CartComponent.vue'),
      meta: { requiresAuth: 'buyer' }
    }, {
      path: '/checkout',
      name: 'Checkout',
      component: () => import('../components/buyerComponents/backUpCheckout.vue'),
      meta: { requiresAuth: 'buyer' }
    }, {
      path: '/purchase',
      name: 'MyPhurchase',
      component: () => import('../components/buyerComponents/PurchaseComponent.vue'),
      meta: { requiresAuth: 'buyer' }
    },
    {
      path: '/buyersettings',
      name: 'BuyerSettings',
      component: () => import('../components/buyerComponents/BuyerSettingsComponent.vue'),
      meta: { requiresAuth: 'buyer' }
    },
    {
      path: '/sellerdashboard',
      name: 'SellerDashboard',
      component: () => import('../components/sellerComponents/productListComponent.vue'),
      meta: { requiresAuth: 'seller' }
    },
    {
      path: '/adminpage',
      name: 'AdminPage',
      component: () => import('../components/adminComponents/adminDashboardComponent.vue'),
      meta: { requiresAuth: 'admin' }
    },
    {
      path: '/seller-list',
      name: 'SellerList',
      component: () => import('../components/adminComponents/sellerListComponent.vue'),
      meta: { requiresAuth: 'admin' }
    },
    {
      path: '/product-list',
      name: 'ProductList',
      component: () => import('../components/adminComponents/productListComponent.vue'),
      meta: { requiresAuth: 'admin' }
    },
    {
      path: '/report-list',
      name: 'ReportList',
      component: () => import('../components/adminComponents/reportsComponent.vue'),
      meta: { requiresAuth: 'admin' }
    },
    // {
    //   path: '/reportnotification',
    //   name: 'ReportList',
    //   component: () => import('../components/adminComponents/reportsComponent.vue'),
    //   meta: { requiresAuth: 'seller' }
    // },
    {
      path: '/sellerorderlist',
      name: 'SellerOrderList',
      component: () => import('../components/sellerComponents/ordersListComponent.vue'),
      meta: { requiresAuth: 'seller' }
    },
    {
      path: '/sellerprofile',
      name: 'SellerProfile',
      component: () => import('../components/sellerComponents/sellerProfileComponent.vue'),
      meta: { requiresAuth: 'seller' }
    }
    ,
    {
      path: '/sellermessages',
      name: 'SellerMessages',
      component: () => import('../components/sellerComponents/sellerMessagesComponent.vue'),
      meta: { requiresAuth: 'seller' }
    },
    {
      path: '/pages/product/:id',
      name: 'ProductPages',
      component: () => import('../pages/productPages.vue'),
      meta: { requiresAuth: 'buyer' }
    },
    {
      path: '/:catchAll(.*)',
      name: 'NotFound',
      component: () => import('../components/NotFoundComponent.vue'),
    }
  ]
});

// Navigation guard to check authentication and roles
router.beforeEach((to, from, next) => {
  const isAuthenticated = !!localStorage.getItem('isLog');
  const role = localStorage.getItem('role');

  // Check if the route requires authentication
  if (to.meta.requiresAuth) {
    if (isAuthenticated) {
      if (to.meta.requiresAuth === role) {
        next(); // User has the correct role, proceed
      } else {
        // Redirect based on the role
        switch (role) {
          case 'admin':
            next({ name: 'AdminPage' });
            break;
          case 'buyer':
            next({ name: 'BuyerDashboard' });
            break;
          case 'seller':
            next({ name: 'SellerDashboard' });
            break;
          default:
            next({ name: 'Login' });
        }
      }
    } else {
      // Not authenticated, redirect to login
      next({ name: 'Login' });
    }
  } else {
    // Route does not require authentication
    if (isAuthenticated) {
      // Redirect authenticated users to their respective dashboards
      switch (role) {
        case 'admin':
          next({ name: 'AdminPage' });
          break;
        case 'buyer':
          next({ name: 'BuyerDashboard' });
          break;
        case 'seller':
          next({ name: 'SellerDashboard' });
          break;
        default:
          next();
      }
    } else {
      next();
    }
  }
});

export default router;
