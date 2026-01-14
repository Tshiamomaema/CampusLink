import React from 'react';
import { 
  Users, 
  BookOpen, 
  Calendar, 
  MessageSquare, 
  ArrowRight, 
  Search, 
  Zap,
  Github,
  Twitter,
  Linkedin
} from 'lucide-react';

function App() {
  return (
    <div className="gradient-bg min-height-screen">
      {/* Background Orbs */}
      <div className="orb orb-1"></div>
      <div className="orb orb-2"></div>

      {/* Navigation */}
      <nav className="glass sticky-top margin-4 padding-inline-6 padding-block-3 margin-inline-auto max-width-1200 z-100 flex items-center justify-between" style={{
        marginTop: '1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: '1.5rem',
        maxWidth: '1200px',
        margin: '1.5rem auto'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{ 
            background: 'var(--primary)', 
            padding: '8px', 
            borderRadius: '10px',
            display: 'flex'
          }}>
            <Zap size={20} color="white" />
          </div>
          <span style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>CampusLink</span>
        </div>
        
        <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
          <a href="#" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Features</a>
          <a href="#" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Community</a>
          <a href="#" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Resources</a>
          <button style={{
            background: 'var(--primary)',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '12px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
          onMouseOver={(e) => (e.currentTarget.style.backgroundColor = 'var(--primary-hover)')}
          onMouseOut={(e) => (e.currentTarget.style.backgroundColor = 'var(--primary)')}
          >
            Join Now
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <main style={{ 
        maxWidth: '1200px', 
        margin: '0 auto', 
        padding: '100px 20px', 
        textAlign: 'center' 
      }}>
        <div className="animate-fade-in">
          <span className="glass" style={{ 
            padding: '6px 16px', 
            borderRadius: '20px', 
            fontSize: '0.875rem', 
            color: 'var(--accent)',
            marginBottom: '2rem',
            display: 'inline-block'
          }}>
            🚀 Re-Imagining Student Networking
          </span>
          <h1 style={{ 
            fontSize: 'clamp(2.5rem, 8vw, 4.5rem)', 
            fontWeight: '800', 
            lineHeight: '1.1',
            marginBottom: '1.5rem'
          }}>
            Connect Your <br />
            <span className="gradient-text">Campus Life</span>
          </h1>
          <p style={{ 
            fontSize: '1.25rem', 
            color: 'var(--text-muted)', 
            maxWidth: '600px', 
            margin: '0 auto 3rem',
            lineHeight: '1.6'
          }}>
            The all-in-one platform for students to collaborate on projects, 
            share resources, and build meaningful academic connections.
          </p>
          
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <button style={{
              background: 'var(--primary)',
              color: 'white',
              border: 'none',
              padding: '16px 32px',
              borderRadius: '14px',
              fontSize: '1.1rem',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              Get Started <ArrowRight size={20} />
            </button>
            <button className="glass" style={{
              color: 'white',
              padding: '16px 32px',
              borderRadius: '14px',
              fontSize: '1.1rem',
              fontWeight: '600',
              cursor: 'pointer'
            }}>
              Watch Demo
            </button>
          </div>
        </div>

        {/* Feature Cards */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
          gap: '2rem', 
          marginTop: '100px' 
        }}>
          <FeatureCard 
            icon={<Users className="gradient-text" />}
            title="Study Groups"
            description="Find or create groups for any subject and collaborate in real-time."
          />
          <FeatureCard 
            icon={<BookOpen className="gradient-text" />}
            title="Resource Sharing"
            description="Securely share notes, guides, and project templates with your peers."
          />
          <FeatureCard 
            icon={<Calendar className="gradient-text" />}
            title="Event Planning"
            description="Stay updated with campus events, workshops, and hackathons."
          />
        </div>
      </main>

      {/* Footer */}
      <footer className="glass" style={{
        marginTop: 'auto',
        padding: '40px 20px',
        maxWidth: '1200px',
        margin: '100px auto 40px',
        width: 'calc(100% - 40px)'
      }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          flexWrap: 'wrap', 
          gap: '2rem' 
        }}>
          <div style={{ maxWidth: '300px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <Zap size={24} color="var(--primary)" />
              <span style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>CampusLink</span>
            </div>
            <p style={{ color: 'var(--text-muted)' }}>Empowering students to build the future of academic collaboration.</p>
          </div>
          
          <div style={{ display: 'flex', gap: '3rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <h4 style={{ marginBottom: '0.5rem' }}>Product</h4>
              <a href="#" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Features</a>
              <a href="#" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Security</a>
              <a href="#" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Roadmap</a>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <h4 style={{ marginBottom: '0.5rem' }}>Connect</h4>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <Twitter size={20} style={{ cursor: 'pointer', color: 'var(--text-muted)' }} />
                <Linkedin size={20} style={{ cursor: 'pointer', color: 'var(--text-muted)' }} />
                <Github size={20} style={{ cursor: 'pointer', color: 'var(--text-muted)' }} />
              </div>
            </div>
          </div>
        </div>
        <div style={{ 
          borderTop: '1px solid var(--glass-border)', 
          marginTop: '2rem', 
          paddingTop: '2rem',
          textAlign: 'center',
          color: 'var(--text-muted)',
          fontSize: '0.875rem'
        }}>
          © 2026 CampusLink. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="glass" style={{ 
      padding: '2.5rem', 
      textAlign: 'left',
      transition: 'transform 0.3s ease',
      cursor: 'pointer'
    }}
    onMouseOver={(e) => (e.currentTarget.style.transform = 'translateY(-10px)')}
    onMouseOut={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
    >
      <div style={{ marginBottom: '1.5rem' }}>{icon}</div>
      <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>{title}</h3>
      <p style={{ color: 'var(--text-muted)', lineHeight: '1.6' }}>{description}</p>
    </div>
  );
}

export default App;
