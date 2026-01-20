import Link from "next/link";
import { TechBackground } from "@/components/autotech";
import { 
  Wrench, 
  BarChart3, 
  Bell, 
  CreditCard, 
  Users, 
  Clock,
  ChevronRight,
  Zap,
  Shield,
  Smartphone
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="min-h-screen relative">
      <TechBackground />

      <div className="relative z-10">
        {/* Navigation */}
        <nav className="border-b border-white/5 backdrop-blur-md sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-electric-cyan to-cobalt-blue flex items-center justify-center">
                  <Wrench className="w-5 h-5 text-white" />
                </div>
                <span className="font-bold text-xl text-white">
                  Auto<span className="text-electric-cyan">Tech</span>
                </span>
              </div>

              <div className="hidden md:flex items-center gap-8">
                <a href="#features" className="text-white/60 hover:text-white transition-colors text-sm">
                  Recursos
                </a>
                <a href="#pricing" className="text-white/60 hover:text-white transition-colors text-sm">
                  Preços
                </a>
                <a href="#demo" className="text-white/60 hover:text-white transition-colors text-sm">
                  Demo
                </a>
              </div>

              <div className="flex items-center gap-3">
                <Button variant="ghost" className="text-white/70 hover:text-white">
                  Entrar
                </Button>
                <Button className="cyan-button">
                  Começar Grátis
                </Button>
              </div>
            </div>
          </div>
        </nav>

        {/* Hero */}
        <section className="py-20 md:py-32">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center max-w-4xl mx-auto">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-electric-cyan/10 border border-electric-cyan/20 text-electric-cyan text-sm mb-8">
                <Zap className="w-4 h-4" />
                Plataforma #1 para oficinas mecânicas
              </div>

              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
                Gestão de oficina no
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-electric-cyan to-cobalt-blue"> próximo nível</span>
              </h1>

              <p className="text-xl text-white/60 mb-10 max-w-2xl mx-auto">
                Ordens de serviço digitais, agendamento online e acompanhamento em tempo real. 
                Seus clientes vão amar a transparência.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="cyan-button h-14 px-8 text-lg">
                  Testar 14 dias grátis
                  <ChevronRight className="w-5 h-5 ml-2" />
                </Button>
                <Link href="/oficina-demo/agendar">
                  <Button size="lg" variant="outline" className="h-14 px-8 text-lg border-white/20 hover:bg-white/5">
                    Ver Demo
                  </Button>
                </Link>
              </div>

              <p className="text-white/40 text-sm mt-6">
                Sem cartão de crédito • Setup em 5 minutos
              </p>
            </div>

            {/* Dashboard Preview */}
            <div className="mt-20 glass-card p-2 rounded-xl max-w-5xl mx-auto">
              <div className="bg-deep-steel rounded-lg p-6 border border-white/5">
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                  <div className="w-3 h-3 rounded-full bg-green-500/80" />
                  <span className="text-white/30 text-xs ml-2 font-mono">autotech.com/oficina-do-vitor</span>
                </div>

                <div className="grid grid-cols-4 gap-4">
                  {[
                    { label: "Em Andamento", value: "12", color: "text-warning-yellow" },
                    { label: "Aguardando Peça", value: "3", color: "text-pending-orange" },
                    { label: "Concluídos Hoje", value: "8", color: "text-neon-green" },
                    { label: "Faturamento", value: "R$ 4.2k", color: "text-electric-cyan" },
                  ].map((stat) => (
                    <div key={stat.label} className="glass-card p-4 rounded-lg">
                      <div className={`text-2xl font-bold font-mono ${stat.color}`}>{stat.value}</div>
                      <div className="text-white/50 text-xs mt-1">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="py-20 border-t border-white/5">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Tudo que sua oficina precisa
              </h2>
              <p className="text-white/60 max-w-2xl mx-auto">
                Ferramentas poderosas para modernizar sua operação e encantar seus clientes.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  icon: BarChart3,
                  title: "Kanban de OS",
                  description: "Visualize todas as ordens de serviço em um quadro intuitivo. Arraste e solte para atualizar status.",
                },
                {
                  icon: Smartphone,
                  title: "Agendamento Online",
                  description: "Seus clientes agendam pelo celular. Sem ligações, sem WhatsApp bagunçado.",
                },
                {
                  icon: Bell,
                  title: "Notificações Automáticas",
                  description: "E-mail automático a cada mudança de status. Cliente informado = cliente feliz.",
                },
                {
                  icon: Clock,
                  title: "Timeline de Reparo",
                  description: "Cliente acompanha cada etapa: Recebido → Orçamento → Reparo → Pronto.",
                },
                {
                  icon: CreditCard,
                  title: "Pagamento Integrado",
                  description: "Receba sinal ou pagamento total via Stripe. Tudo registrado automaticamente.",
                },
                {
                  icon: Users,
                  title: "Multi-tenant",
                  description: "Cada oficina tem sua URL exclusiva: autotech.com/sua-oficina",
                },
              ].map((feature) => (
                <div key={feature.title} className="glass-card-hover p-6 rounded-xl group">
                  <div className="w-12 h-12 rounded-lg bg-electric-cyan/10 flex items-center justify-center mb-4 group-hover:bg-electric-cyan/20 transition-colors">
                    <feature.icon className="w-6 h-6 text-electric-cyan" />
                  </div>
                  <h3 className="text-white font-semibold text-lg mb-2">{feature.title}</h3>
                  <p className="text-white/50 text-sm">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 border-t border-white/5">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <div className="glass-card p-12 rounded-2xl relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-electric-cyan/10 to-cobalt-blue/10" />
              <div className="relative z-10">
                <Shield className="w-12 h-12 text-electric-cyan mx-auto mb-6" />
                <h2 className="text-3xl font-bold text-white mb-4">
                  Pronto para modernizar sua oficina?
                </h2>
                <p className="text-white/60 mb-8 max-w-xl mx-auto">
                  Junte-se a centenas de oficinas que já usam AutoTech para impressionar seus clientes.
                </p>
                <Button size="lg" className="cyan-button h-14 px-10 text-lg">
                  Começar Agora — É Grátis
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-white/5 py-12">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-electric-cyan/20 flex items-center justify-center">
                  <Wrench className="w-4 h-4 text-electric-cyan" />
                </div>
                <span className="font-bold text-white">
                  Auto<span className="text-electric-cyan">Tech</span>
                </span>
              </div>
              <div className="text-white/40 text-sm">
                © 2024 AutoTech. Todos os direitos reservados.
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
