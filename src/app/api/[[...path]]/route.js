import { NextResponse } from 'next/server'
import { v4 as uuidv4 } from 'uuid'
import {
  mockUsers,
  mockBarbershops,
  mockServices,
  mockBarbers,
  mockAppointments,
  mockReviews,
  mockPosts,
  mockComments
} from '../../../lib/mockData.js'

// In-memory data store (until real Supabase is configured)
let users = [...mockUsers]
let barbershops = [...mockBarbershops]
let services = [...mockServices]
let barbers = [...mockBarbers]
let appointments = [...mockAppointments]
let reviews = [...mockReviews]
let posts = [...mockPosts]
let comments = [...mockComments]

// Helper function to handle CORS
function handleCORS(response) {
  response.headers.set('Access-Control-Allow-Origin', process.env.CORS_ORIGINS || '*')
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH')
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  response.headers.set('Access-Control-Allow-Credentials', 'true')
  return response
}

// OPTIONS handler for CORS
export async function OPTIONS() {
  return handleCORS(new NextResponse(null, { status: 200 }))
}

// Main route handler
async function handleRoute(request, { params }) {
  const { path = [] } = params
  const route = `/${path.join('/')}`
  const method = request.method

  try {
    // ========================================
    // ROOT / HEALTH CHECK
    // ========================================
    if ((route === '/root' || route === '/') && method === 'GET') {
      return handleCORS(NextResponse.json({ 
        message: "Barbershop Management System API", 
        version: "1.0.0",
        endpoints: {
          barbershops: '/api/barbershops',
          services: '/api/services',
          barbers: '/api/barbers',
          appointments: '/api/appointments',
          users: '/api/users',
          reviews: '/api/reviews',
          posts: '/api/posts',
          stats: '/api/stats'
        }
      }))
    }

    // ========================================
    // BARBERSHOPS ENDPOINTS
    // ========================================
    
    // GET /api/barbershops - Get all barbershops
    if (route === '/barbershops' && method === 'GET') {
      return handleCORS(NextResponse.json(barbershops))
    }

    // GET /api/barbershops/:slug - Get barbershop by slug
    if (route.match(/^\/barbershops\/[^/]+$/) && method === 'GET') {
      const slug = path[1]
      const barbershop = barbershops.find(b => b.slug === slug || b.id === slug)
      if (!barbershop) {
        return handleCORS(NextResponse.json({ error: 'Barbershop not found' }, { status: 404 }))
      }
      return handleCORS(NextResponse.json(barbershop))
    }

    // POST /api/barbershops - Create barbershop
    if (route === '/barbershops' && method === 'POST') {
      const body = await request.json()
      const newBarbershop = {
        id: `bb_${uuidv4().slice(0, 8)}`,
        ...body,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
      barbershops.push(newBarbershop)
      return handleCORS(NextResponse.json(newBarbershop, { status: 201 }))
    }

    // PUT /api/barbershops/:id - Update barbershop
    if (route.match(/^\/barbershops\/[^/]+$/) && method === 'PUT') {
      const id = path[1]
      const body = await request.json()
      const index = barbershops.findIndex(b => b.id === id)
      if (index === -1) {
        return handleCORS(NextResponse.json({ error: 'Barbershop not found' }, { status: 404 }))
      }
      barbershops[index] = { 
        ...barbershops[index], 
        ...body, 
        updated_at: new Date().toISOString() 
      }
      return handleCORS(NextResponse.json(barbershops[index]))
    }

    // DELETE /api/barbershops/:id - Delete barbershop
    if (route.match(/^\/barbershops\/[^/]+$/) && method === 'DELETE') {
      const id = path[1]
      const index = barbershops.findIndex(b => b.id === id)
      if (index === -1) {
        return handleCORS(NextResponse.json({ error: 'Barbershop not found' }, { status: 404 }))
      }
      barbershops.splice(index, 1)
      return handleCORS(NextResponse.json({ message: 'Barbershop deleted successfully' }))
    }

    // ========================================
    // SERVICES ENDPOINTS
    // ========================================
    
    // GET /api/services - Get all services (with optional barbershop_id filter)
    if (route === '/services' && method === 'GET') {
      const url = new URL(request.url)
      const barbershopId = url.searchParams.get('barbershop_id')
      
      let filteredServices = services
      if (barbershopId) {
        filteredServices = services.filter(s => s.barbershop_id === barbershopId)
      }
      
      return handleCORS(NextResponse.json(filteredServices))
    }

    // GET /api/services/:id - Get service by ID
    if (route.match(/^\/services\/[^/]+$/) && method === 'GET') {
      const id = path[1]
      const service = services.find(s => s.id === id)
      if (!service) {
        return handleCORS(NextResponse.json({ error: 'Service not found' }, { status: 404 }))
      }
      return handleCORS(NextResponse.json(service))
    }

    // POST /api/services - Create service
    if (route === '/services' && method === 'POST') {
      const body = await request.json()
      const newService = {
        id: `srv_${uuidv4().slice(0, 8)}`,
        ...body,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
      services.push(newService)
      return handleCORS(NextResponse.json(newService, { status: 201 }))
    }

    // PUT /api/services/:id - Update service
    if (route.match(/^\/services\/[^/]+$/) && method === 'PUT') {
      const id = path[1]
      const body = await request.json()
      const index = services.findIndex(s => s.id === id)
      if (index === -1) {
        return handleCORS(NextResponse.json({ error: 'Service not found' }, { status: 404 }))
      }
      services[index] = { 
        ...services[index], 
        ...body, 
        updated_at: new Date().toISOString() 
      }
      return handleCORS(NextResponse.json(services[index]))
    }

    // DELETE /api/services/:id - Delete service
    if (route.match(/^\/services\/[^/]+$/) && method === 'DELETE') {
      const id = path[1]
      const index = services.findIndex(s => s.id === id)
      if (index === -1) {
        return handleCORS(NextResponse.json({ error: 'Service not found' }, { status: 404 }))
      }
      services.splice(index, 1)
      return handleCORS(NextResponse.json({ message: 'Service deleted successfully' }))
    }

    // ========================================
    // BARBERS ENDPOINTS
    // ========================================
    
    // GET /api/barbers - Get all barbers (with optional barbershop_id filter)
    if (route === '/barbers' && method === 'GET') {
      const url = new URL(request.url)
      const barbershopId = url.searchParams.get('barbershop_id')
      
      let filteredBarbers = barbers
      if (barbershopId) {
        filteredBarbers = barbers.filter(b => b.barbershop_id === barbershopId)
      }
      
      return handleCORS(NextResponse.json(filteredBarbers))
    }

    // GET /api/barbers/:id - Get barber by ID
    if (route.match(/^\/barbers\/[^/]+$/) && method === 'GET') {
      const id = path[1]
      const barber = barbers.find(b => b.id === id)
      if (!barber) {
        return handleCORS(NextResponse.json({ error: 'Barber not found' }, { status: 404 }))
      }
      return handleCORS(NextResponse.json(barber))
    }

    // POST /api/barbers - Create barber
    if (route === '/barbers' && method === 'POST') {
      const body = await request.json()
      const newBarber = {
        id: `brb_${uuidv4().slice(0, 8)}`,
        ...body,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
      barbers.push(newBarber)
      return handleCORS(NextResponse.json(newBarber, { status: 201 }))
    }

    // PUT /api/barbers/:id - Update barber
    if (route.match(/^\/barbers\/[^/]+$/) && method === 'PUT') {
      const id = path[1]
      const body = await request.json()
      const index = barbers.findIndex(b => b.id === id)
      if (index === -1) {
        return handleCORS(NextResponse.json({ error: 'Barber not found' }, { status: 404 }))
      }
      barbers[index] = { 
        ...barbers[index], 
        ...body, 
        updated_at: new Date().toISOString() 
      }
      return handleCORS(NextResponse.json(barbers[index]))
    }

    // DELETE /api/barbers/:id - Delete barber
    if (route.match(/^\/barbers\/[^/]+$/) && method === 'DELETE') {
      const id = path[1]
      const index = barbers.findIndex(b => b.id === id)
      if (index === -1) {
        return handleCORS(NextResponse.json({ error: 'Barber not found' }, { status: 404 }))
      }
      barbers.splice(index, 1)
      return handleCORS(NextResponse.json({ message: 'Barber deleted successfully' }))
    }

    // ========================================
    // APPOINTMENTS ENDPOINTS
    // ========================================
    
    // GET /api/appointments - Get all appointments (with optional filters)
    if (route === '/appointments' && method === 'GET') {
      const url = new URL(request.url)
      const barbershopId = url.searchParams.get('barbershop_id')
      const barberId = url.searchParams.get('barber_id')
      const date = url.searchParams.get('date')
      const status = url.searchParams.get('status')
      
      let filteredAppointments = appointments
      
      if (barbershopId) {
        filteredAppointments = filteredAppointments.filter(a => a.barbershop_id === barbershopId)
      }
      if (barberId) {
        filteredAppointments = filteredAppointments.filter(a => a.barber_id === barberId)
      }
      if (date) {
        filteredAppointments = filteredAppointments.filter(a => a.appointment_date === date)
      }
      if (status) {
        filteredAppointments = filteredAppointments.filter(a => a.status === status)
      }
      
      // Enrich with related data
      const enrichedAppointments = filteredAppointments.map(apt => ({
        ...apt,
        barber: barbers.find(b => b.id === apt.barber_id),
        client: users.find(u => u.id === apt.client_id),
        service: services.find(s => s.id === apt.service_id)
      }))
      
      return handleCORS(NextResponse.json(enrichedAppointments))
    }

    // GET /api/appointments/:id - Get appointment by ID
    if (route.match(/^\/appointments\/[^/]+$/) && method === 'GET') {
      const id = path[1]
      const appointment = appointments.find(a => a.id === id)
      if (!appointment) {
        return handleCORS(NextResponse.json({ error: 'Appointment not found' }, { status: 404 }))
      }
      
      // Enrich with related data
      const enrichedAppointment = {
        ...appointment,
        barber: barbers.find(b => b.id === appointment.barber_id),
        client: users.find(u => u.id === appointment.client_id),
        service: services.find(s => s.id === appointment.service_id)
      }
      
      return handleCORS(NextResponse.json(enrichedAppointment))
    }

    // POST /api/appointments - Create appointment
    if (route === '/appointments' && method === 'POST') {
      const body = await request.json()
      const newAppointment = {
        id: `apt_${uuidv4().slice(0, 8)}`,
        ...body,
        status: body.status || 'pending',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
      appointments.push(newAppointment)
      return handleCORS(NextResponse.json(newAppointment, { status: 201 }))
    }

    // PUT /api/appointments/:id - Update appointment
    if (route.match(/^\/appointments\/[^/]+$/) && method === 'PUT') {
      const id = path[1]
      const body = await request.json()
      const index = appointments.findIndex(a => a.id === id)
      if (index === -1) {
        return handleCORS(NextResponse.json({ error: 'Appointment not found' }, { status: 404 }))
      }
      appointments[index] = { 
        ...appointments[index], 
        ...body, 
        updated_at: new Date().toISOString() 
      }
      return handleCORS(NextResponse.json(appointments[index]))
    }

    // PATCH /api/appointments/:id/status - Update appointment status
    if (route.match(/^\/appointments\/[^/]+\/status$/) && method === 'PATCH') {
      const id = path[1]
      const body = await request.json()
      const index = appointments.findIndex(a => a.id === id)
      if (index === -1) {
        return handleCORS(NextResponse.json({ error: 'Appointment not found' }, { status: 404 }))
      }
      appointments[index] = { 
        ...appointments[index], 
        status: body.status,
        updated_at: new Date().toISOString() 
      }
      return handleCORS(NextResponse.json(appointments[index]))
    }

    // DELETE /api/appointments/:id - Delete appointment
    if (route.match(/^\/appointments\/[^/]+$/) && method === 'DELETE') {
      const id = path[1]
      const index = appointments.findIndex(a => a.id === id)
      if (index === -1) {
        return handleCORS(NextResponse.json({ error: 'Appointment not found' }, { status: 404 }))
      }
      appointments.splice(index, 1)
      return handleCORS(NextResponse.json({ message: 'Appointment deleted successfully' }))
    }

    // ========================================
    // USERS ENDPOINTS
    // ========================================
    
    // GET /api/users - Get all users (with optional role filter)
    if (route === '/users' && method === 'GET') {
      const url = new URL(request.url)
      const role = url.searchParams.get('role')
      
      let filteredUsers = users
      if (role) {
        filteredUsers = users.filter(u => u.role === role)
      }
      
      return handleCORS(NextResponse.json(filteredUsers))
    }

    // GET /api/users/:id - Get user by ID
    if (route.match(/^\/users\/[^/]+$/) && method === 'GET') {
      const id = path[1]
      const user = users.find(u => u.id === id)
      if (!user) {
        return handleCORS(NextResponse.json({ error: 'User not found' }, { status: 404 }))
      }
      return handleCORS(NextResponse.json(user))
    }

    // POST /api/users - Create user
    if (route === '/users' && method === 'POST') {
      const body = await request.json()
      const newUser = {
        id: `user_${uuidv4().slice(0, 8)}`,
        ...body,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      users.push(newUser)
      return handleCORS(NextResponse.json(newUser, { status: 201 }))
    }

    // PUT /api/users/:id - Update user
    if (route.match(/^\/users\/[^/]+$/) && method === 'PUT') {
      const id = path[1]
      const body = await request.json()
      const index = users.findIndex(u => u.id === id)
      if (index === -1) {
        return handleCORS(NextResponse.json({ error: 'User not found' }, { status: 404 }))
      }
      users[index] = { 
        ...users[index], 
        ...body, 
        updatedAt: new Date().toISOString() 
      }
      return handleCORS(NextResponse.json(users[index]))
    }

    // ========================================
    // REVIEWS ENDPOINTS
    // ========================================
    
    // GET /api/reviews - Get all reviews (with optional barbershop_id filter)
    if (route === '/reviews' && method === 'GET') {
      const url = new URL(request.url)
      const barbershopId = url.searchParams.get('barbershop_id')
      const approved = url.searchParams.get('approved')
      
      let filteredReviews = reviews
      
      if (barbershopId) {
        filteredReviews = filteredReviews.filter(r => r.barbershop_id === barbershopId)
      }
      if (approved !== null && approved !== undefined) {
        const isApproved = approved === 'true'
        filteredReviews = filteredReviews.filter(r => r.is_approved === isApproved)
      }
      
      // Enrich with user data
      const enrichedReviews = filteredReviews.map(review => ({
        ...review,
        user: users.find(u => u.id === review.user_id)
      }))
      
      return handleCORS(NextResponse.json(enrichedReviews))
    }

    // POST /api/reviews - Create review
    if (route === '/reviews' && method === 'POST') {
      const body = await request.json()
      const newReview = {
        id: `rev_${uuidv4().slice(0, 8)}`,
        ...body,
        is_approved: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
      reviews.push(newReview)
      return handleCORS(NextResponse.json(newReview, { status: 201 }))
    }

    // PATCH /api/reviews/:id/approve - Approve/reject review
    if (route.match(/^\/reviews\/[^/]+\/approve$/) && method === 'PATCH') {
      const id = path[1]
      const body = await request.json()
      const index = reviews.findIndex(r => r.id === id)
      if (index === -1) {
        return handleCORS(NextResponse.json({ error: 'Review not found' }, { status: 404 }))
      }
      reviews[index] = { 
        ...reviews[index], 
        is_approved: body.is_approved,
        updated_at: new Date().toISOString() 
      }
      return handleCORS(NextResponse.json(reviews[index]))
    }

    // DELETE /api/reviews/:id - Delete review
    if (route.match(/^\/reviews\/[^/]+$/) && method === 'DELETE') {
      const id = path[1]
      const index = reviews.findIndex(r => r.id === id)
      if (index === -1) {
        return handleCORS(NextResponse.json({ error: 'Review not found' }, { status: 404 }))
      }
      reviews.splice(index, 1)
      return handleCORS(NextResponse.json({ message: 'Review deleted successfully' }))
    }

    // ========================================
    // POSTS ENDPOINTS
    // ========================================
    
    // GET /api/posts - Get all posts (with optional barbershop_id filter)
    if (route === '/posts' && method === 'GET') {
      const url = new URL(request.url)
      const barbershopId = url.searchParams.get('barbershop_id')
      const postType = url.searchParams.get('type')
      const published = url.searchParams.get('published')
      
      let filteredPosts = posts
      
      if (barbershopId) {
        filteredPosts = filteredPosts.filter(p => p.barbershop_id === barbershopId)
      }
      if (postType) {
        filteredPosts = filteredPosts.filter(p => p.post_type === postType)
      }
      if (published !== null && published !== undefined) {
        const isPublished = published === 'true'
        filteredPosts = filteredPosts.filter(p => p.is_published === isPublished)
      }
      
      // Sort by date (newest first)
      filteredPosts.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      
      return handleCORS(NextResponse.json(filteredPosts))
    }

    // GET /api/posts/:id - Get post by ID
    if (route.match(/^\/posts\/[^/]+$/) && method === 'GET') {
      const id = path[1]
      const post = posts.find(p => p.id === id)
      if (!post) {
        return handleCORS(NextResponse.json({ error: 'Post not found' }, { status: 404 }))
      }
      return handleCORS(NextResponse.json(post))
    }

    // POST /api/posts - Create post
    if (route === '/posts' && method === 'POST') {
      const body = await request.json()
      const newPost = {
        id: `post_${uuidv4().slice(0, 8)}`,
        ...body,
        is_published: body.is_published !== undefined ? body.is_published : true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
      posts.push(newPost)
      return handleCORS(NextResponse.json(newPost, { status: 201 }))
    }

    // PUT /api/posts/:id - Update post
    if (route.match(/^\/posts\/[^/]+$/) && method === 'PUT') {
      const id = path[1]
      const body = await request.json()
      const index = posts.findIndex(p => p.id === id)
      if (index === -1) {
        return handleCORS(NextResponse.json({ error: 'Post not found' }, { status: 404 }))
      }
      posts[index] = { 
        ...posts[index], 
        ...body, 
        updated_at: new Date().toISOString() 
      }
      return handleCORS(NextResponse.json(posts[index]))
    }

    // DELETE /api/posts/:id - Delete post
    if (route.match(/^\/posts\/[^/]+$/) && method === 'DELETE') {
      const id = path[1]
      const index = posts.findIndex(p => p.id === id)
      if (index === -1) {
        return handleCORS(NextResponse.json({ error: 'Post not found' }, { status: 404 }))
      }
      posts.splice(index, 1)
      return handleCORS(NextResponse.json({ message: 'Post deleted successfully' }))
    }

    // ========================================
    // COMMENTS ENDPOINTS
    // ========================================
    
    // GET /api/comments - Get comments for a post
    if (route === '/comments' && method === 'GET') {
      const url = new URL(request.url)
      const postId = url.searchParams.get('post_id')
      
      let filteredComments = comments
      
      if (postId) {
        filteredComments = comments.filter(c => c.post_id === postId)
      }
      
      // Enrich with user data
      const enrichedComments = filteredComments.map(comment => ({
        ...comment,
        user: users.find(u => u.id === comment.user_id)
      }))
      
      return handleCORS(NextResponse.json(enrichedComments))
    }

    // POST /api/comments - Create comment
    if (route === '/comments' && method === 'POST') {
      const body = await request.json()
      const newComment = {
        id: `cmt_${uuidv4().slice(0, 8)}`,
        ...body,
        is_approved: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
      comments.push(newComment)
      return handleCORS(NextResponse.json(newComment, { status: 201 }))
    }

    // PATCH /api/comments/:id/approve - Approve/reject comment
    if (route.match(/^\/comments\/[^/]+\/approve$/) && method === 'PATCH') {
      const id = path[1]
      const body = await request.json()
      const index = comments.findIndex(c => c.id === id)
      if (index === -1) {
        return handleCORS(NextResponse.json({ error: 'Comment not found' }, { status: 404 }))
      }
      comments[index] = { 
        ...comments[index], 
        is_approved: body.is_approved,
        updated_at: new Date().toISOString() 
      }
      return handleCORS(NextResponse.json(comments[index]))
    }

    // DELETE /api/comments/:id - Delete comment
    if (route.match(/^\/comments\/[^/]+$/) && method === 'DELETE') {
      const id = path[1]
      const index = comments.findIndex(c => c.id === id)
      if (index === -1) {
        return handleCORS(NextResponse.json({ error: 'Comment not found' }, { status: 404 }))
      }
      comments.splice(index, 1)
      return handleCORS(NextResponse.json({ message: 'Comment deleted successfully' }))
    }

    // ========================================
    // STATS/DASHBOARD ENDPOINTS
    // ========================================
    
    // GET /api/stats/:barbershop_id - Get dashboard statistics
    if (route.match(/^\/stats\/[^/]+$/) && method === 'GET') {
      const barbershopId = path[1]
      
      const barbershopAppointments = appointments.filter(a => a.barbershop_id === barbershopId)
      const barbershopServices = services.filter(s => s.barbershop_id === barbershopId)
      const barbershopBarbers = barbers.filter(b => b.barbershop_id === barbershopId)
      const barbershopReviews = reviews.filter(r => r.barbershop_id === barbershopId && r.is_approved)
      
      // Today's appointments
      const today = new Date().toISOString().split('T')[0]
      const todayAppointments = barbershopAppointments.filter(a => a.appointment_date === today)
      
      // Revenue calculation (this week)
      const weekAgo = new Date()
      weekAgo.setDate(weekAgo.getDate() - 7)
      const recentAppointments = barbershopAppointments.filter(a => {
        const aptDate = new Date(a.appointment_date)
        return aptDate >= weekAgo && a.status === 'completed'
      })
      
      const weekRevenue = recentAppointments.reduce((sum, apt) => {
        const service = services.find(s => s.id === apt.service_id)
        return sum + (service ? parseFloat(service.price) : 0)
      }, 0)
      
      // Average rating
      const avgRating = barbershopReviews.length > 0
        ? barbershopReviews.reduce((sum, r) => sum + r.rating, 0) / barbershopReviews.length
        : 0
      
      const stats = {
        total_appointments: barbershopAppointments.length,
        today_appointments: todayAppointments.length,
        pending_appointments: barbershopAppointments.filter(a => a.status === 'pending').length,
        confirmed_appointments: barbershopAppointments.filter(a => a.status === 'confirmed').length,
        total_services: barbershopServices.length,
        active_services: barbershopServices.filter(s => s.is_active).length,
        total_barbers: barbershopBarbers.length,
        active_barbers: barbershopBarbers.filter(b => b.is_active).length,
        total_reviews: barbershopReviews.length,
        pending_reviews: reviews.filter(r => r.barbershop_id === barbershopId && !r.is_approved).length,
        average_rating: avgRating.toFixed(1),
        week_revenue: weekRevenue.toFixed(2),
        recent_appointments: barbershopAppointments
          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
          .slice(0, 5)
          .map(apt => ({
            ...apt,
            barber: barbers.find(b => b.id === apt.barber_id),
            client: users.find(u => u.id === apt.client_id),
            service: services.find(s => s.id === apt.service_id)
          }))
      }
      
      return handleCORS(NextResponse.json(stats))
    }

    // ========================================
    // NOT FOUND
    // ========================================
    return handleCORS(NextResponse.json({ 
      error: 'Endpoint not found',
      route,
      method 
    }, { status: 404 }))

  } catch (error) {
    console.error('API Error:', error)
    return handleCORS(NextResponse.json({ 
      error: 'Internal server error',
      message: error.message 
    }, { status: 500 }))
  }
}

// Export all HTTP methods
export const GET = handleRoute
export const POST = handleRoute
export const PUT = handleRoute
export const PATCH = handleRoute
export const DELETE = handleRoute
