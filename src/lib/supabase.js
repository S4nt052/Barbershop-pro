import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Initialize database with sample data
export const initializeDatabase = async () => {
  try {
    // Check if barbershops exist
    const { data: existingData } = await supabase
      .from('barbershops')
      .select('id')
      .limit(1)
    
    if (!existingData || existingData.length === 0) {
      await initializeSampleData()
    }
    
    console.log('Database initialized successfully')
  } catch (error) {
    console.error('Database initialization error:', error)
  }
}

// Sample data for testing
export const initializeSampleData = async () => {
  const sampleBarbershops = [
    {
      id: 'bb_001',
      name: 'BarberShop Elite',
      slug: 'barbershop-elite',
      owner_id: 'user_owner_001',
      logo_url: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=400',
      description: 'La mejor barbería de la ciudad con más de 10 años de experiencia',
      address: 'Av. Principal 123, Centro',
      phone: '+34 600 123 456',
      email: 'info@barbershopelite.com',
      settings: {
        show_public_site: true,
        allow_reviews: true,
        allow_posts: true,
        allow_online_booking: true
      },
      created_at: new Date().toISOString()
    },
    {
      id: 'bb_002',
      name: 'The Gentleman Cut',
      slug: 'gentleman-cut',
      owner_id: 'user_owner_002',
      logo_url: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=400',
      description: 'Estilo clásico y moderno para el caballero contemporáneo',
      address: 'Calle Elegante 45, Barrio Moderno',
      phone: '+34 600 789 012',
      email: 'contact@gentlemancut.com',
      settings: {
        show_public_site: true,
        allow_reviews: true,
        allow_posts: true,
        allow_online_booking: true
      },
      created_at: new Date().toISOString()
    },
    {
      id: 'bb_003',
      name: 'Urban Style Barbers',
      slug: 'urban-style',
      owner_id: 'user_owner_003',
      logo_url: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=400',
      description: 'Tendencias urbanas y cortes vanguardistas',
      address: 'Plaza Moderna 78, Distrito Joven',
      phone: '+34 600 345 678',
      email: 'hello@urbanstyle.com',
      settings: {
        show_public_site: true,
        allow_reviews: false,
        allow_posts: true,
        allow_online_booking: true
      },
      created_at: new Date().toISOString()
    }
  ]

  const sampleServices = [
    // BarberShop Elite services
    { id: 'srv_001', barbershop_id: 'bb_001', name: 'Corte Clásico', description: 'Corte tradicional con tijera y máquina', price: 25.00, duration: 30, is_active: true, promo_price: null },
    { id: 'srv_002', barbershop_id: 'bb_001', name: 'Corte + Barba', description: 'Corte completo más arreglo de barba', price: 35.00, duration: 45, is_active: true, promo_price: 29.99 },
    { id: 'srv_003', barbershop_id: 'bb_001', name: 'Afeitado Clásico', description: 'Afeitado con navaja y toalla caliente', price: 20.00, duration: 25, is_active: true, promo_price: null },
    { id: 'srv_004', barbershop_id: 'bb_001', name: 'Degradado Moderno', description: 'Fade profesional con diseño', price: 30.00, duration: 40, is_active: true, promo_price: null },
    // The Gentleman Cut services
    { id: 'srv_005', barbershop_id: 'bb_002', name: 'Executive Cut', description: 'Corte ejecutivo premium', price: 40.00, duration: 45, is_active: true, promo_price: null },
    { id: 'srv_006', barbershop_id: 'bb_002', name: 'Gentleman Package', description: 'Corte + barba + masaje facial', price: 60.00, duration: 60, is_active: true, promo_price: 49.99 },
    { id: 'srv_007', barbershop_id: 'bb_002', name: 'Beard Styling', description: 'Diseño y perfilado de barba', price: 25.00, duration: 30, is_active: true, promo_price: null },
    // Urban Style services
    { id: 'srv_008', barbershop_id: 'bb_003', name: 'Urban Fade', description: 'Degradado urbano con diseño', price: 28.00, duration: 35, is_active: true, promo_price: null },
    { id: 'srv_009', barbershop_id: 'bb_003', name: 'Color Treatment', description: 'Tinte o decoloración', price: 50.00, duration: 90, is_active: true, promo_price: null },
    { id: 'srv_010', barbershop_id: 'bb_003', name: 'Kids Cut', description: 'Corte para niños hasta 12 años', price: 18.00, duration: 25, is_active: true, promo_price: 15.00 }
  ]

  const sampleBarbers = [
    { id: 'brb_001', barbershop_id: 'bb_001', user_id: 'user_barber_001', name: 'Carlos Martínez', specialty: 'Cortes clásicos y fade', commission_rate: 0.50, is_active: true, avatar_url: 'https://i.pravatar.cc/150?img=12' },
    { id: 'brb_002', barbershop_id: 'bb_001', user_id: 'user_barber_002', name: 'Miguel Ruiz', specialty: 'Barbería y afeitado', commission_rate: 0.50, is_active: true, avatar_url: 'https://i.pravatar.cc/150?img=13' },
    { id: 'brb_003', barbershop_id: 'bb_002', user_id: 'user_barber_003', name: 'Antonio López', specialty: 'Cortes premium', commission_rate: 0.60, is_active: true, avatar_url: 'https://i.pravatar.cc/150?img=14' },
    { id: 'brb_004', barbershop_id: 'bb_003', user_id: 'user_barber_004', name: 'David García', specialty: 'Estilos urbanos', commission_rate: 0.55, is_active: true, avatar_url: 'https://i.pravatar.cc/150?img=15' }
  ]

  const sampleUsers = [
    { id: 'user_owner_001', email: 'owner1@barbershop.com', full_name: 'Juan Pérez', role: 'owner', avatar_url: 'https://i.pravatar.cc/150?img=1' },
    { id: 'user_owner_002', email: 'owner2@barbershop.com', full_name: 'Pedro Gómez', role: 'owner', avatar_url: 'https://i.pravatar.cc/150?img=2' },
    { id: 'user_owner_003', email: 'owner3@barbershop.com', full_name: 'Luis Fernández', role: 'owner', avatar_url: 'https://i.pravatar.cc/150?img=3' },
    { id: 'user_barber_001', email: 'carlos@barbershop.com', full_name: 'Carlos Martínez', role: 'barber', avatar_url: 'https://i.pravatar.cc/150?img=12' },
    { id: 'user_barber_002', email: 'miguel@barbershop.com', full_name: 'Miguel Ruiz', role: 'barber', avatar_url: 'https://i.pravatar.cc/150?img=13' },
    { id: 'user_barber_003', email: 'antonio@barbershop.com', full_name: 'Antonio López', role: 'barber', avatar_url: 'https://i.pravatar.cc/150?img=14' },
    { id: 'user_barber_004', email: 'david@barbershop.com', full_name: 'David García', role: 'barber', avatar_url: 'https://i.pravatar.cc/150?img=15' },
    { id: 'user_client_001', email: 'client1@email.com', full_name: 'Roberto Torres', role: 'client', avatar_url: 'https://i.pravatar.cc/150?img=20' },
    { id: 'user_client_002', email: 'client2@email.com', full_name: 'Fernando Sánchez', role: 'client', avatar_url: 'https://i.pravatar.cc/150?img=21' }
  ]

  const sampleAppointments = [
    { id: 'apt_001', barbershop_id: 'bb_001', barber_id: 'brb_001', client_id: 'user_client_001', service_id: 'srv_002', appointment_date: '2025-06-15', appointment_time: '10:00', status: 'confirmed', notes: 'Cliente prefiere fade bajo', created_at: new Date().toISOString() },
    { id: 'apt_002', barbershop_id: 'bb_001', barber_id: 'brb_002', client_id: 'user_client_002', service_id: 'srv_001', appointment_date: '2025-06-15', appointment_time: '11:00', status: 'confirmed', notes: '', created_at: new Date().toISOString() },
    { id: 'apt_003', barbershop_id: 'bb_001', barber_id: 'brb_001', client_id: 'user_client_001', service_id: 'srv_004', appointment_date: '2025-06-15', appointment_time: '15:30', status: 'pending', notes: 'Primera vez', created_at: new Date().toISOString() },
    { id: 'apt_004', barbershop_id: 'bb_002', barber_id: 'brb_003', client_id: 'user_client_002', service_id: 'srv_005', appointment_date: '2025-06-16', appointment_time: '09:00', status: 'confirmed', notes: '', created_at: new Date().toISOString() }
  ]

  const sampleReviews = [
    { id: 'rev_001', barbershop_id: 'bb_001', user_id: 'user_client_001', rating: 5, comment: 'Excelente servicio, muy profesionales. Totalmente recomendado!', is_approved: true, created_at: new Date().toISOString() },
    { id: 'rev_002', barbershop_id: 'bb_001', user_id: 'user_client_002', rating: 4, comment: 'Buen corte, aunque tuve que esperar un poco.', is_approved: true, created_at: new Date().toISOString() },
    { id: 'rev_003', barbershop_id: 'bb_002', user_id: 'user_client_001', rating: 5, comment: 'El mejor corte que me han hecho. Volveré seguro.', is_approved: true, created_at: new Date().toISOString() }
  ]

  const samplePosts = [
    { id: 'post_001', barbershop_id: 'bb_001', title: 'Nuevo estilo: Mid Fade', description: 'Mira este increíble degradado medio que hicimos hoy', image_url: 'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=600', post_type: 'corte', is_published: true, created_at: new Date().toISOString() },
    { id: 'post_002', barbershop_id: 'bb_001', title: '20% OFF en Paquetes', description: 'Esta semana todos los paquetes con descuento especial', image_url: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=600', post_type: 'promo', is_published: true, created_at: new Date().toISOString() },
    { id: 'post_003', barbershop_id: 'bb_002', title: 'Evento VIP Weekend', description: 'Evento especial este fin de semana con servicios premium', image_url: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=600', post_type: 'evento', is_published: true, created_at: new Date().toISOString() }
  ]

  try {
    // Insert data
    await supabase.from('users').insert(sampleUsers)
    await supabase.from('barbershops').insert(sampleBarbershops)
    await supabase.from('services').insert(sampleServices)
    await supabase.from('barbers').insert(sampleBarbers)
    await supabase.from('appointments').insert(sampleAppointments)
    await supabase.from('reviews').insert(sampleReviews)
    await supabase.from('posts').insert(samplePosts)

    console.log('Sample data inserted successfully')
  } catch (error) {
    console.error('Error inserting sample data:', error)
  }
}
