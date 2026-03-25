import type { AstroCookies } from 'astro';

export type Lang = 'en' | 'pt';

const d = {
  en: {
    catalog: 'CATALOGUE',
    library: 'My Library',
    admin: 'Admin Panel',
    hello: 'Hello',
    logout: 'Logout',
    login: 'Login',
    cart: 'CART',
    art: 'THE ART OF MOVEMENT',
    hero_title: 'FEEL THE<br><span>RHYTHM</span>',
    hero_sub: 'Learn from the greatest masters of Brazilian dance. Technique, expression and energy in every class.',
    explore: 'Explore Classes',
    our_masters: 'Our Masters',
    teachers: 'Teachers',
    prof_sub: 'Each teacher brings a unique journey of technique, expression, and passion for dance.',
    view_classes: 'View Classes',
    empty_prof_title: 'No teachers registered',
    empty_prof_text: 'Run Appwrite setup or add teachers in admin.',
    checkout: 'Checkout',
    secure_pay: '100% Secure Payment',
    total: 'Total',
    empty_cart: 'Empty cart',
    add_classes: 'Add classes to your cart.',
    footer_rights: 'All rights reserved',
    welcome_back: 'Welcome back',
    email: 'Email',
    password: 'Password',
    no_account: 'No account?',
    create_account: 'Create account',
    join_us: 'Join us',
    full_name: 'Full name',
    pass_min: 'Password (min. 8 chars)',
    has_account: 'Already have an account?',
    avail_classes: 'Available Classes',
    free_preview: 'Free Preview',
    free: 'Free',
    watch: 'Watch',
    add_to_cart: 'Add to Cart',
    in_cart: 'In Cart',
  },
  pt: {
    catalog: 'Catálogo',
    library: 'Minha Biblioteca',
    admin: 'Painel Admin',
    hello: 'Olá',
    logout: 'Sair',
    login: 'Entrar',
    cart: 'Carrinho',
    art: 'Arte em Movimento',
    hero_title: 'Aprenda com os<br><span>Melhores Mestres</span>',
    hero_sub: 'Aulas exclusivas de dança com professores de nível internacional.',
    explore: 'Explorar Aulas',
    our_masters: 'Nossos Mestres',
    teachers: 'Professores',
    prof_sub: 'Cada professor traz uma jornada única de técnica, expressão e paixão pela dança.',
    view_classes: 'Ver Aulas',
    empty_prof_title: 'Nenhum professor cadastrado',
    empty_prof_text: 'Execute o setup do Appwrite ou adicione professores no admin.',
    checkout: 'Finalizar Compra',
    secure_pay: 'Pagamento 100% seguro',
    total: 'Total',
    empty_cart: 'Carrinho vazio',
    add_classes: 'Adicione aulas ao carrinho.',
    footer_rights: 'Todos os direitos reservados',
    welcome_back: 'Bem-vindo de volta',
    email: 'E-mail',
    password: 'Senha',
    no_account: 'Não tem conta?',
    create_account: 'Criar conta',
    join_us: 'Junte-se a nós',
    full_name: 'Nome completo',
    pass_min: 'Senha (mín. 8 caracteres)',
    has_account: 'Já tem conta?',
    avail_classes: 'Aulas Disponíveis',
    free_preview: 'Preview Gratuito',
    free: 'Grátis',
    watch: 'Assistir',
    add_to_cart: 'Adicionar ao Carrinho',
    in_cart: 'No Carrinho',
  }
};

export function getLang(cookies: AstroCookies, url: URL): Lang {
  // 1. Check URL param ?lang=pt
  const qLang = url.searchParams.get('lang');
  if (qLang === 'pt' || qLang === 'en') {
    cookies.set('escola_lang', qLang, { path: '/', maxAge: 60 * 60 * 24 * 365 });
    return qLang;
  }
  // 2. Check cookie
  const cLang = cookies.get('escola_lang')?.value;
  if (cLang === 'pt' || cLang === 'en') return cLang;
  
  // 3. Default to EN
  return 'en';
}

export function useTranslations(lang: Lang) {
  return function t(key: keyof typeof d['en']): string {
    return d[lang][key] || d['en'][key];
  }
}
