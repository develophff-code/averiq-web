import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Solutions } from './components/Solutions';
import { InteractiveSimulator } from './components/InteractiveSimulator';
import { Methodology } from './components/Methodology';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { LiveChatWidget } from './components/LiveChatWidget';

export function App() {
  return (
    <div className="min-h-screen bg-[#080C14] text-slate-100 selection:bg-cyan-500/30 selection:text-cyan-200">
      <Navbar />
      <main>
        <Hero />
        <Solutions />
        <InteractiveSimulator />
        <Methodology />
        <ContactSection />
      </main>
      <Footer />
      <LiveChatWidget />
    </div>
  );
}

export default App;
