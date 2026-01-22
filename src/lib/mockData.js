// Mock data for demo purposes (until real Supabase credentials are provided)
export const mockUsers = [
  { id: 'user_owner_001', email: 'owner1@barbershop.com', full_name: 'Juan Pérez', role: 'owner', avatar_url: 'https://i.pravatar.cc/150?img=1', phone: '+34 600 111 111' },
  { id: 'user_owner_002', email: 'owner2@barbershop.com', full_name: 'Pedro Gómez', role: 'owner', avatar_url: 'https://i.pravatar.cc/150?img=2', phone: '+34 600 222 222' },
  { id: 'user_owner_003', email: 'owner3@barbershop.com', full_name: 'Luis Fernández', role: 'owner', avatar_url: 'https://i.pravatar.cc/150?img=3', phone: '+34 600 333 333' },
  { id: 'user_barber_001', email: 'carlos@barbershop.com', full_name: 'Carlos Martínez', role: 'barber', avatar_url: 'https://i.pravatar.cc/150?img=12', phone: '+34 600 444 444' },
  { id: 'user_barber_002', email: 'miguel@barbershop.com', full_name: 'Miguel Ruiz', role: 'barber', avatar_url: 'https://i.pravatar.cc/150?img=13', phone: '+34 600 555 555' },
  { id: 'user_barber_003', email: 'antonio@barbershop.com', full_name: 'Antonio López', role: 'barber', avatar_url: 'https://i.pravatar.cc/150?img=14', phone: '+34 600 666 666' },
  { id: 'user_barber_004', email: 'david@barbershop.com', full_name: 'David García', role: 'barber', avatar_url: 'https://i.pravatar.cc/150?img=15', phone: '+34 600 777 777' },
  { id: 'user_client_001', email: 'client1@email.com', full_name: 'Roberto Torres', role: 'client', avatar_url: 'https://i.pravatar.cc/150?img=20', phone: '+34 600 888 888' },
  { id: 'user_client_002', email: 'client2@email.com', full_name: 'Fernando Sánchez', role: 'client', avatar_url: 'https://i.pravatar.cc/150?img=21', phone: '+34 600 999 999' },
  { id: 'user_client_003', email: 'client3@email.com', full_name: 'Jorge Ramírez', role: 'client', avatar_url: 'https://i.pravatar.cc/150?img=22', phone: '+34 600 101 010' }
]

export const mockBarbershops = [
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

export const mockServices = [
  // BarberShop Elite services
  { id: 'srv_001', barbershop_id: 'bb_001', name: 'Corte Clásico', description: 'Corte tradicional con tijera y máquina', price: 25.00, duration: 30, is_active: true, promo_price: null, category: 'cortes' },
  { id: 'srv_002', barbershop_id: 'bb_001', name: 'Corte + Barba', description: 'Corte completo más arreglo de barba', price: 35.00, duration: 45, is_active: true, promo_price: 29.99, category: 'paquetes' },
  { id: 'srv_003', barbershop_id: 'bb_001', name: 'Afeitado Clásico', description: 'Afeitado con navaja y toalla caliente', price: 20.00, duration: 25, is_active: true, promo_price: null, category: 'barba' },
  { id: 'srv_004', barbershop_id: 'bb_001', name: 'Degradado Moderno', description: 'Fade profesional con diseño', price: 30.00, duration: 40, is_active: true, promo_price: null, category: 'cortes' },
  // The Gentleman Cut services
  { id: 'srv_005', barbershop_id: 'bb_002', name: 'Executive Cut', description: 'Corte ejecutivo premium', price: 40.00, duration: 45, is_active: true, promo_price: null, category: 'cortes' },
  { id: 'srv_006', barbershop_id: 'bb_002', name: 'Gentleman Package', description: 'Corte + barba + masaje facial', price: 60.00, duration: 60, is_active: true, promo_price: 49.99, category: 'paquetes' },
  { id: 'srv_007', barbershop_id: 'bb_002', name: 'Beard Styling', description: 'Diseño y perfilado de barba', price: 25.00, duration: 30, is_active: true, promo_price: null, category: 'barba' },
  // Urban Style services
  { id: 'srv_008', barbershop_id: 'bb_003', name: 'Urban Fade', description: 'Degradado urbano con diseño', price: 28.00, duration: 35, is_active: true, promo_price: null, category: 'cortes' },
  { id: 'srv_009', barbershop_id: 'bb_003', name: 'Color Treatment', description: 'Tinte o decoloración', price: 50.00, duration: 90, is_active: true, promo_price: null, category: 'color' },
  { id: 'srv_010', barbershop_id: 'bb_003', name: 'Kids Cut', description: 'Corte para niños hasta 12 años', price: 18.00, duration: 25, is_active: true, promo_price: 15.00, category: 'cortes' }
]

export const mockBarbers = [
  { id: 'brb_001', barbershop_id: 'bb_001', user_id: 'user_barber_001', name: 'Carlos Martínez', specialty: 'Cortes clásicos y fade', commission_rate: 0.50, is_active: true, avatar_url: 'https://i.pravatar.cc/150?img=12' },
  { id: 'brb_002', barbershop_id: 'bb_001', user_id: 'user_barber_002', name: 'Miguel Ruiz', specialty: 'Barbería y afeitado', commission_rate: 0.50, is_active: true, avatar_url: 'https://i.pravatar.cc/150?img=13' },
  { id: 'brb_003', barbershop_id: 'bb_002', user_id: 'user_barber_003', name: 'Antonio López', specialty: 'Cortes premium', commission_rate: 0.60, is_active: true, avatar_url: 'https://i.pravatar.cc/150?img=14' },
  { id: 'brb_004', barbershop_id: 'bb_003', user_id: 'user_barber_004', name: 'David García', specialty: 'Estilos urbanos', commission_rate: 0.55, is_active: true, avatar_url: 'https://i.pravatar.cc/150?img=15' }
]

export const mockAppointments = [
  { id: 'apt_001', barbershop_id: 'bb_001', barber_id: 'brb_001', client_id: 'user_client_001', service_id: 'srv_002', appointment_date: '2025-06-15', appointment_time: '10:00', status: 'confirmed', notes: 'Cliente prefiere fade bajo', created_at: new Date().toISOString() },
  { id: 'apt_002', barbershop_id: 'bb_001', barber_id: 'brb_002', client_id: 'user_client_002', service_id: 'srv_001', appointment_date: '2025-06-15', appointment_time: '11:00', status: 'confirmed', notes: '', created_at: new Date().toISOString() },
  { id: 'apt_003', barbershop_id: 'bb_001', barber_id: 'brb_001', client_id: 'user_client_001', service_id: 'srv_004', appointment_date: '2025-06-15', appointment_time: '15:30', status: 'pending', notes: 'Primera vez', created_at: new Date().toISOString() },
  { id: 'apt_004', barbershop_id: 'bb_002', barber_id: 'brb_003', client_id: 'user_client_002', service_id: 'srv_005', appointment_date: '2025-06-16', appointment_time: '09:00', status: 'confirmed', notes: '', created_at: new Date().toISOString() },
  { id: 'apt_005', barbershop_id: 'bb_001', barber_id: 'brb_001', client_id: 'user_client_003', service_id: 'srv_001', appointment_date: '2025-06-16', appointment_time: '14:00', status: 'pending', notes: 'Llamar antes de confirmar', created_at: new Date().toISOString() },
  { id: 'apt_006', barbershop_id: 'bb_001', barber_id: 'brb_002', client_id: 'user_client_001', service_id: 'srv_003', appointment_date: '2025-06-17', appointment_time: '10:30', status: 'confirmed', notes: '', created_at: new Date().toISOString() },
  { id: 'apt_007', barbershop_id: 'bb_003', barber_id: 'brb_004', client_id: 'user_client_002', service_id: 'srv_008', appointment_date: '2025-06-17', appointment_time: '16:00', status: 'pending', notes: '', created_at: new Date().toISOString() }
]

export const mockReviews = [
  { id: 'rev_001', barbershop_id: 'bb_001', user_id: 'user_client_001', rating: 5, comment: 'Excelente servicio, muy profesionales. Totalmente recomendado!', is_approved: true, created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() },
  { id: 'rev_002', barbershop_id: 'bb_001', user_id: 'user_client_002', rating: 4, comment: 'Buen corte, aunque tuve que esperar un poco.', is_approved: true, created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString() },
  { id: 'rev_003', barbershop_id: 'bb_002', user_id: 'user_client_001', rating: 5, comment: 'El mejor corte que me han hecho. Volveré seguro.', is_approved: true, created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() },
  { id: 'rev_004', barbershop_id: 'bb_001', user_id: 'user_client_003', rating: 5, comment: 'Carlos es un maestro, siempre atento y profesional', is_approved: true, created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() },
  { id: 'rev_005', barbershop_id: 'bb_003', user_id: 'user_client_002', rating: 4, comment: 'Muy buen ambiente y estilo moderno', is_approved: false, created_at: new Date().toISOString() }
]

export const mockPosts = [
  { id: 'post_001', barbershop_id: 'bb_001', title: 'Nuevo estilo: Mid Fade', description: 'Mira este increíble degradado medio que hicimos hoy', image_url: 'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=600', post_type: 'corte', is_published: true, created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() },
  { id: 'post_002', barbershop_id: 'bb_001', title: '20% OFF en Paquetes', description: 'Esta semana todos los paquetes con descuento especial', image_url: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=600', post_type: 'promo', is_published: true, created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() },
  { id: 'post_003', barbershop_id: 'bb_002', title: 'Evento VIP Weekend', description: 'Evento especial este fin de semana con servicios premium', image_url: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=600', post_type: 'evento', is_published: true, created_at: new Date().toISOString() },
  { id: 'post_004', barbershop_id: 'bb_001', title: 'Nuevo barbero en el equipo', description: 'Dale la bienvenida a nuestro nuevo talento', image_url: 'https://images.unsplash.com/photo-1605497788044-5a32c7078486?w=600', post_type: 'corte', is_published: true, created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString() },
  { id: 'post_005', barbershop_id: 'bb_003', title: 'Street Style Special', description: 'Diseños únicos inspirados en el street art', image_url: 'https://images.unsplash.com/photo-1621607512214-68297480165e?w=600', post_type: 'corte', is_published: true, created_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString() }
]

export const mockComments = [
  { id: 'cmt_001', post_id: 'post_001', user_id: 'user_client_001', content: '¡Qué buen corte! Me encanta el resultado', is_approved: true, created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() },
  { id: 'cmt_002', post_id: 'post_002', user_id: 'user_client_002', content: 'Aprovechando la promo este fin de semana!', is_approved: true, created_at: new Date().toISOString() },
  { id: 'cmt_003', post_id: 'post_001', user_id: 'user_client_003', content: '¿Cuánto cuesta este estilo?', is_approved: false, created_at: new Date().toISOString() }
]
