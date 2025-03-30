import { Component } from '@angular/core';

@Component({
  standalone: false,

  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent {
  teamMembers = [
    {
      name: 'Ana Paula Soares',
      role: 'CEO & Fundadora',
      bio: 'Com mais de 15 anos de experiência em comércio eletrônico, Ana fundou a Revenda de Ingressos com o objetivo de criar uma plataforma segura e confiável para todos.',
      image: 'assets/team-1.jpg'
    },
    {
      name: 'Marcos Oliveira',
      role: 'CTO',
      bio: 'Especialista em tecnologia e segurança digital, Marcos lidera nossa equipe de desenvolvedores garantindo a melhor experiência para nossos usuários.',
      image: 'assets/team-2.jpg'
    },
    {
      name: 'Carolina Mendes',
      role: 'Diretora de Marketing',
      bio: 'Com experiência em grandes empresas do setor de entretenimento, Carolina é responsável por todas as estratégias de marketing e parcerias.',
      image: 'assets/team-3.jpg'
    }
  ];

  partnerLogos = [
    { name: 'Festival Brasil', logo: 'assets/partner-1.png' },
    { name: 'Show Productions', logo: 'assets/partner-2.png' },
    { name: 'Estádio Nacional', logo: 'assets/partner-3.png' },
    { name: 'Teatro Municipal', logo: 'assets/partner-4.png' },
    { name: 'EventBR', logo: 'assets/partner-5.png' },
    { name: 'Music Tickets', logo: 'assets/partner-6.png' }
  ];

  faqItems = [
    {
      question: 'Como comprar ingressos na plataforma?',
      answer: 'É simples! Basta criar uma conta gratuita, buscar pelo evento desejado, selecionar o ingresso e efetuar o pagamento de forma segura. Após a confirmação, você receberá seu ingresso por e-mail.'
    },
    {
      question: 'É seguro comprar ingressos de revendedores?',
      answer: 'Sim! Nossa plataforma verifica a autenticidade de todos os ingressos e vendedores. Além disso, oferecemos garantia de reembolso caso haja qualquer problema com o ingresso adquirido.'
    },
    {
      question: 'Posso revender meus ingressos se não puder comparecer ao evento?',
      answer: 'Sim, você pode revender seus ingressos na nossa plataforma. Basta criar um anúncio, definir o preço (de acordo com nossas políticas) e aguardar a venda. Após a conclusão, transferimos o valor para sua conta.'
    },
    {
      question: 'Quais são as taxas cobradas pela plataforma?',
      answer: 'Cobramos uma taxa de serviço de 10% do valor do ingresso para compradores e 5% para vendedores. Estas taxas nos ajudam a manter a plataforma segura e a oferecer suporte de qualidade.'
    },
    {
      question: 'Como recebo meu ingresso após a compra?',
      answer: 'Após a confirmação do pagamento, os ingressos são enviados para o e-mail cadastrado em sua conta. Você também pode acessá-los a qualquer momento na seção "Meus Ingressos" do seu perfil.'
    }
  ];
}