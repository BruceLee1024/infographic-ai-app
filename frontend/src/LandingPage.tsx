import { useState, useEffect, useRef } from 'react';
import { Button, Input, Card, Tag } from 'antd';
import { ArrowRightOutlined, PlayCircleOutlined, RobotOutlined, CheckOutlined, CrownOutlined, ThunderboltOutlined } from '@ant-design/icons';
import { PaymentModal } from './components/PaymentModal';

const { TextArea } = Input;

// 快速开始示例
const QUICK_STARTS = [
    { emoji: '📊', label: '产品路线图' },
    { emoji: '📈', label: '数据报表' },
    { emoji: '🔄', label: '流程图' },
    { emoji: '⚖️', label: 'SWOT 分析' },
    { emoji: '🏢', label: '组织架构' },
];

export const LandingPage = ({ onStart }: { onStart: (prompt?: string) => void }) => {
    const [inputValue, setInputValue] = useState('');
    const [scrollY, setScrollY] = useState(0);
    const [paymentModalVisible, setPaymentModalVisible] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<'subscription' | 'lifetime'>('subscription');
    const heroRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleScroll = () => setScrollY(window.scrollY);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleQuickStart = (label: string) => {
        const prompt = `帮我生成一个${label}`;
        setInputValue(prompt);
        // 直接跳转并生成
        onStart(prompt);
    };

    const handleSubmit = () => {
        onStart(inputValue || undefined);
    };

    const handlePurchase = (productType: 'subscription' | 'lifetime') => {
        setSelectedProduct(productType);
        setPaymentModalVisible(true);
    };

    return (
        <div style={{ 
            minHeight: '100vh',
            background: '#faf9f7',
            fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
            overflow: 'hidden',
            position: 'relative'
        }}>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
                
                * { 
                    box-sizing: border-box; 
                }
                body { margin: 0; }
                
                /* 背景渐变 - 参考 Base44 的米色到淡蓝渐变 */
                .bg-gradient {
                    position: fixed;
                    inset: 0;
                    background: linear-gradient(
                        180deg, 
                        #f8f5f1 0%, 
                        #f3f0ec 25%,
                        #e8ecf3 55%,
                        #dce4ef 80%,
                        #d0dcea 100%
                    );
                    z-index: 0;
                }
                
                /* 底部橙色光晕 - Base44 特色 */
                .bg-glow {
                    position: fixed;
                    bottom: -250px;
                    left: 50%;
                    transform: translateX(-50%);
                    width: 1600px;
                    height: 800px;
                    background: radial-gradient(
                        ellipse at center,
                        rgba(255, 107, 53, 0.32) 0%,
                        rgba(255, 140, 70, 0.18) 30%,
                        rgba(255, 170, 100, 0.08) 55%,
                        transparent 80%
                    );
                    filter: blur(70px);
                    z-index: 1;
                    pointer-events: none;
                }
                
                /* 粘性导航栏 - 毛玻璃效果 */
                .nav-glass {
                    background: rgba(255, 255, 255, 0.72);
                    backdrop-filter: blur(24px);
                    -webkit-backdrop-filter: blur(24px);
                    border: 1px solid rgba(255, 255, 255, 0.9);
                    box-shadow: 0 2px 20px rgba(0, 0, 0, 0.03);
                }
                
                .nav-link {
                    color: #52525b;
                    text-decoration: none;
                    font-size: 15px;
                    font-weight: 500;
                    padding: 10px 20px;
                    border-radius: 10px;
                    transition: all 0.2s ease;
                    letter-spacing: 0.02em;
                }
                
                .nav-link:hover {
                    background: rgba(0,0,0,0.04);
                    color: #18181b;
                }
                
                /* 毛玻璃卡片 */
                .glass-card {
                    background: rgba(255, 255, 255, 0.65);
                    backdrop-filter: blur(24px);
                    -webkit-backdrop-filter: blur(24px);
                    border: 1px solid rgba(255, 255, 255, 0.85);
                    box-shadow: 0 4px 32px rgba(0, 0, 0, 0.04);
                }
                
                /* 输入框容器 */
                .input-container {
                    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                    box-shadow: 
                        0 4px 40px rgba(0, 0, 0, 0.04),
                        0 1px 3px rgba(0, 0, 0, 0.02);
                }
                
                .input-container:focus-within {
                    box-shadow: 
                        0 20px 60px rgba(0, 0, 0, 0.08),
                        0 4px 8px rgba(0, 0, 0, 0.02);
                    transform: translateY(-4px);
                }
                
                /* 快速标签 */
                .quick-tag {
                    display: inline-flex;
                    align-items: center;
                    gap: 12px;
                    padding: 14px 28px;
                    background: rgba(255, 255, 255, 0.75);
                    backdrop-filter: blur(12px);
                    border: 1px solid rgba(0, 0, 0, 0.05);
                    border-radius: 100px;
                    font-size: 15px;
                    font-weight: 500;
                    color: #52525b;
                    cursor: pointer;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    letter-spacing: 0.03em;
                }
                
                .quick-tag:hover {
                    background: rgba(255, 255, 255, 0.95);
                    border-color: rgba(0, 0, 0, 0.08);
                    transform: translateY(-3px);
                    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.06);
                }
                
                /* 主 CTA 按钮 */
                .cta-primary {
                    background: #18181b !important;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    letter-spacing: 0.04em;
                }
                
                .cta-primary:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.18);
                    background: #27272a !important;
                }
                
                /* 发送按钮 */
                .send-button {
                    width: 56px;
                    height: 56px;
                    border-radius: 50%;
                    background: linear-gradient(135deg, #ff6b35 0%, #ff8f5a 100%);
                    border: none;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    box-shadow: 0 8px 24px rgba(255, 107, 53, 0.35);
                }
                
                .send-button:hover {
                    transform: scale(1.08);
                    box-shadow: 0 12px 32px rgba(255, 107, 53, 0.45);
                }
                
                /* 功能卡片 */
                .feature-card {
                    background: rgba(255, 255, 255, 0.55);
                    backdrop-filter: blur(20px);
                    -webkit-backdrop-filter: blur(20px);
                    border: 1px solid rgba(255, 255, 255, 0.8);
                    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                }
                
                .feature-card:hover {
                    background: rgba(255, 255, 255, 0.8);
                    transform: translateY(-6px);
                    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.06);
                }
                
                /* 滚动评价动画 */
                @keyframes scroll-left {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                
                @keyframes scroll-right {
                    0% { transform: translateX(-50%); }
                    100% { transform: translateX(0); }
                }
                
                /* 淡入动画 */
                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                
                .animate-in {
                    animation: fadeInUp 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards;
                }
                
                /* 标题样式 */
                .hero-title {
                    font-size: clamp(56px, 10vw, 96px);
                    font-weight: 700;
                    line-height: 1.05;
                    color: #18181b;
                    letter-spacing: -0.03em;
                }
                
                .section-title {
                    font-size: clamp(40px, 6vw, 64px);
                    font-weight: 700;
                    color: #18181b;
                    letter-spacing: -0.02em;
                    line-height: 1.1;
                }
                
                .section-desc {
                    font-size: 20px;
                    color: #71717a;
                    letter-spacing: 0.01em;
                    line-height: 1.7;
                }
            `}</style>

            {/* 背景 */}
            <div className="bg-gradient" />
            <div className="bg-glow" />

            {/* 粘性导航栏 */}
            <nav className="nav-glass" style={{
                position: 'fixed',
                top: scrollY > 50 ? 12 : 20,
                left: scrollY > 50 ? 12 : 24,
                right: scrollY > 50 ? 12 : 24,
                padding: scrollY > 50 ? '12px 28px' : '16px 36px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                zIndex: 100,
                borderRadius: 16,
                transition: 'all 0.3s ease'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <div style={{
                        width: 44,
                        height: 44,
                        background: 'linear-gradient(135deg, #ff6b35 0%, #ff8f5a 100%)',
                        borderRadius: 14,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 22,
                        color: '#fff',
                        boxShadow: '0 6px 16px rgba(255, 107, 53, 0.25)'
                    }}>
                        <RobotOutlined />
                    </div>
                    <span style={{ 
                        fontSize: 20, 
                        fontWeight: 700, 
                        color: '#18181b',
                        letterSpacing: '-0.02em'
                    }}>
                        Infographic<span style={{ color: '#ff6b35' }}>AI</span>
                    </span>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <a href="#features" className="nav-link">功能</a>
                    <a href="#testimonials" className="nav-link">评价</a>
                    <a href="#pricing" className="nav-link">价格</a>
                </div>
                
                <Button 
                    type="primary"
                    onClick={() => onStart()}
                    className="cta-primary"
                    style={{
                        height: 48,
                        padding: '0 28px',
                        fontSize: 15,
                        fontWeight: 600,
                        border: 'none',
                        borderRadius: 12,
                    }}
                >
                    开始创作
                </Button>
            </nav>

            {/* Hero Section */}
            <section ref={heroRef} style={{
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                padding: '160px 32px 120px',
                position: 'relative',
                zIndex: 2
            }}>
                {/* 主标题 */}
                <h1 className="hero-title animate-in" style={{
                    margin: '0 0 32px',
                    maxWidth: 1000
                }}>
                    用 <span style={{ color: '#ff6b35' }}>AI</span> 将想法
                    <br />
                    变成<span style={{ color: '#ff6b35' }}>专业信息图</span>
                </h1>

                {/* 副标题 */}
                <p className="animate-in" style={{
                    fontSize: 'clamp(18px, 2.5vw, 22px)',
                    color: '#71717a',
                    maxWidth: 640,
                    margin: '0 0 56px',
                    lineHeight: 1.8,
                    letterSpacing: '0.01em',
                    animationDelay: '0.1s'
                }}>
                    描述你的想法，<span style={{ color: '#52525b', fontWeight: 500 }}>AI 帮你生成</span>精美信息图。
                    <br />
                    无需设计技能，<span style={{ color: '#52525b', fontWeight: 500 }}>人人都能创作</span>专业级作品。
                </p>

                {/* 输入框 */}
                <div 
                    className="input-container glass-card animate-in"
                    style={{
                        width: '100%',
                        maxWidth: 720,
                        borderRadius: 28,
                        padding: 12,
                        marginBottom: 48,
                        animationDelay: '0.2s'
                    }}
                >
                    <div style={{ position: 'relative' }}>
                        <TextArea
                            value={inputValue}
                            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setInputValue(e.target.value)}
                            placeholder="描述你想要的信息图，例如：帮我生成一个产品开发流程图..."
                            autoSize={{ minRows: 3, maxRows: 6 }}
                            style={{
                                border: 'none',
                                fontSize: 18,
                                padding: '22px 80px 22px 28px',
                                resize: 'none',
                                background: 'transparent',
                                lineHeight: 1.7,
                                letterSpacing: '0.01em',
                                color: '#18181b'
                            }}
                        />
                        <button 
                            className="send-button"
                            onClick={handleSubmit}
                            style={{
                                position: 'absolute',
                                right: 16,
                                bottom: 16
                            }}
                        >
                            <ArrowRightOutlined style={{ color: '#fff', fontSize: 22 }} />
                        </button>
                    </div>
                </div>

                {/* 快速开始 */}
                <div className="animate-in" style={{ animationDelay: '0.3s' }}>
                    <p style={{ 
                        fontSize: 14, 
                        color: '#a1a1aa', 
                        marginBottom: 20,
                        letterSpacing: '0.04em',
                        textTransform: 'uppercase',
                        fontWeight: 500
                    }}>
                        快速开始
                    </p>
                    <div style={{ 
                        display: 'flex', 
                        flexWrap: 'wrap', 
                        gap: 14, 
                        justifyContent: 'center' 
                    }}>
                        {QUICK_STARTS.map(item => (
                            <div 
                                key={item.label}
                                className="quick-tag"
                                onClick={() => handleQuickStart(item.label)}
                            >
                                <span style={{ fontSize: 18 }}>{item.emoji}</span>
                                <span>{item.label}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 用户评价滚动区域 */}
            <section id="testimonials" style={{
                padding: '100px 0',
                position: 'relative',
                zIndex: 2,
                overflow: 'hidden'
            }}>
                <div style={{ textAlign: 'center', marginBottom: 64 }}>
                    <h2 className="section-title" style={{ marginBottom: 20 }}>
                        深受<span style={{ color: '#ff6b35' }}>用户喜爱</span>
                    </h2>
                    <p className="section-desc">
                        来自各行各业的创作者都在使用
                    </p>
                </div>

                {/* 滚动评价 - 向左 */}
                <div style={{ 
                    display: 'flex',
                    animation: 'scroll-left 45s linear infinite',
                    marginBottom: 24
                }}>
                    {[...TESTIMONIALS, ...TESTIMONIALS].map((t, i) => (
                        <div key={i} className="feature-card" style={{
                            minWidth: 380,
                            padding: '32px 36px',
                            borderRadius: 24,
                            marginRight: 24
                        }}>
                            <p style={{ 
                                fontSize: 16, 
                                color: '#52525b', 
                                lineHeight: 1.8,
                                marginBottom: 24,
                                letterSpacing: '0.01em'
                            }}>
                                "{t.content}"
                            </p>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                                <div style={{
                                    width: 48,
                                    height: 48,
                                    borderRadius: '50%',
                                    background: t.color,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: 18,
                                    color: '#fff',
                                    fontWeight: 600
                                }}>
                                    {t.name[0]}
                                </div>
                                <div>
                                    <div style={{ 
                                        fontWeight: 600, 
                                        fontSize: 15,
                                        color: '#18181b',
                                        letterSpacing: '0.01em'
                                    }}>{t.name}</div>
                                    <div style={{ 
                                        fontSize: 14, 
                                        color: '#a1a1aa',
                                        letterSpacing: '0.01em'
                                    }}>{t.role}</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* 滚动评价 - 向右 */}
                <div style={{ 
                    display: 'flex',
                    animation: 'scroll-right 50s linear infinite'
                }}>
                    {[...TESTIMONIALS_2, ...TESTIMONIALS_2].map((t, i) => (
                        <div key={i} className="feature-card" style={{
                            minWidth: 380,
                            padding: '32px 36px',
                            borderRadius: 24,
                            marginRight: 24
                        }}>
                            <p style={{ 
                                fontSize: 16, 
                                color: '#52525b', 
                                lineHeight: 1.8,
                                marginBottom: 24,
                                letterSpacing: '0.01em'
                            }}>
                                "{t.content}"
                            </p>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                                <div style={{
                                    width: 48,
                                    height: 48,
                                    borderRadius: '50%',
                                    background: t.color,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: 18,
                                    color: '#fff',
                                    fontWeight: 600
                                }}>
                                    {t.name[0]}
                                </div>
                                <div>
                                    <div style={{ 
                                        fontWeight: 600, 
                                        fontSize: 15,
                                        color: '#18181b',
                                        letterSpacing: '0.01em'
                                    }}>{t.name}</div>
                                    <div style={{ 
                                        fontSize: 14, 
                                        color: '#a1a1aa',
                                        letterSpacing: '0.01em'
                                    }}>{t.role}</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* 三步流程 */}
            <section id="features" style={{
                padding: '120px 32px',
                position: 'relative',
                zIndex: 2
            }}>
                <div style={{ maxWidth: 1200, margin: '0 auto' }}>
                    <div style={{ textAlign: 'center', marginBottom: 80 }}>
                        <p style={{
                            fontSize: 14,
                            color: '#ff6b35',
                            fontWeight: 600,
                            letterSpacing: '0.1em',
                            textTransform: 'uppercase',
                            marginBottom: 16
                        }}>
                            简单三步
                        </p>
                        <h2 className="section-title" style={{ marginBottom: 20 }}>
                            从想法到<span style={{ color: '#ff6b35' }}>作品</span>
                        </h2>
                        <p className="section-desc" style={{ maxWidth: 500, margin: '0 auto' }}>
                            无需学习复杂工具，AI 帮你完成一切
                        </p>
                    </div>

                    <div style={{ 
                        display: 'grid', 
                        gridTemplateColumns: 'repeat(3, 1fr)', 
                        gap: 32 
                    }}>
                        {STEPS.map((step, i) => (
                            <div key={i} className="feature-card" style={{
                                padding: '56px 44px',
                                borderRadius: 28,
                                textAlign: 'center'
                            }}>
                                <div style={{
                                    width: 88,
                                    height: 88,
                                    borderRadius: 24,
                                    background: step.bg,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: 40,
                                    margin: '0 auto 32px'
                                }}>
                                    {step.icon}
                                </div>
                                <div style={{
                                    display: 'inline-block',
                                    padding: '6px 16px',
                                    background: 'rgba(255, 107, 53, 0.1)',
                                    borderRadius: 100,
                                    fontSize: 13,
                                    color: '#ff6b35',
                                    fontWeight: 600,
                                    marginBottom: 20,
                                    letterSpacing: '0.05em'
                                }}>
                                    步骤 {i + 1}
                                </div>
                                <h3 style={{
                                    fontSize: 26,
                                    fontWeight: 700,
                                    color: '#18181b',
                                    marginBottom: 16,
                                    letterSpacing: '-0.01em'
                                }}>
                                    {step.title}
                                </h3>
                                <p style={{
                                    fontSize: 16,
                                    color: '#71717a',
                                    lineHeight: 1.7,
                                    letterSpacing: '0.01em'
                                }}>
                                    {step.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 核心功能 */}
            <section style={{
                padding: '80px 32px 140px',
                position: 'relative',
                zIndex: 2
            }}>
                <div style={{ maxWidth: 1200, margin: '0 auto' }}>
                    <div style={{ textAlign: 'center', marginBottom: 72 }}>
                        <p style={{
                            fontSize: 14,
                            color: '#ff6b35',
                            fontWeight: 600,
                            letterSpacing: '0.1em',
                            textTransform: 'uppercase',
                            marginBottom: 16
                        }}>
                            核心功能
                        </p>
                        <h2 className="section-title" style={{ marginBottom: 20 }}>
                            <span style={{ color: '#ff6b35' }}>专业级功能</span>，零门槛使用
                        </h2>
                    </div>

                    <div style={{ 
                        display: 'grid', 
                        gridTemplateColumns: 'repeat(2, 1fr)', 
                        gap: 28 
                    }}>
                        {FEATURES.map((f, i) => (
                            <div key={i} className="feature-card" style={{
                                padding: '48px 52px',
                                borderRadius: 28,
                                display: 'flex',
                                gap: 32,
                                alignItems: 'flex-start'
                            }}>
                                <div style={{
                                    width: 72,
                                    height: 72,
                                    borderRadius: 20,
                                    background: f.bg,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: 34,
                                    flexShrink: 0
                                }}>
                                    {f.icon}
                                </div>
                                <div>
                                    <h3 style={{
                                        fontSize: 24,
                                        fontWeight: 700,
                                        color: '#18181b',
                                        marginBottom: 12,
                                        letterSpacing: '-0.01em'
                                    }}>
                                        {f.title}
                                    </h3>
                                    <p style={{
                                        fontSize: 16,
                                        color: '#71717a',
                                        lineHeight: 1.7,
                                        letterSpacing: '0.01em',
                                        margin: 0
                                    }}>
                                        {f.desc}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 价格方案 */}
            <section id="pricing" style={{
                padding: '120px 32px',
                position: 'relative',
                zIndex: 2
            }}>
                <div style={{ maxWidth: 1200, margin: '0 auto' }}>
                    <div style={{ textAlign: 'center', marginBottom: 72 }}>
                        <p style={{
                            fontSize: 14,
                            color: '#ff6b35',
                            fontWeight: 600,
                            letterSpacing: '0.1em',
                            textTransform: 'uppercase',
                            marginBottom: 16
                        }}>
                            定价方案
                        </p>
                        <h2 className="section-title" style={{ marginBottom: 20 }}>
                            选择<span style={{ color: '#ff6b35' }}>适合你</span>的方案
                        </h2>
                        <p className="section-desc" style={{ maxWidth: 600, margin: '0 auto' }}>
                            灵活的定价，满足不同需求
                        </p>
                    </div>

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
                        gap: 32,
                        maxWidth: 960,
                        margin: '0 auto'
                    }}>
                        {/* 订阅版 */}
                        <Card
                            className="feature-card"
                            style={{
                                borderRadius: 28,
                                border: '1px solid rgba(0,0,0,0.08)',
                                position: 'relative',
                                overflow: 'visible'
                            }}
                            bodyStyle={{ padding: 48 }}
                        >
                            <div style={{ marginBottom: 32 }}>
                                <div style={{
                                    width: 64,
                                    height: 64,
                                    borderRadius: 18,
                                    background: 'linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    marginBottom: 24,
                                    boxShadow: '0 8px 24px rgba(59, 130, 246, 0.25)'
                                }}>
                                    <ThunderboltOutlined style={{ fontSize: 32, color: '#fff' }} />
                                </div>
                                <h3 style={{
                                    fontSize: 28,
                                    fontWeight: 700,
                                    color: '#18181b',
                                    marginBottom: 12,
                                    letterSpacing: '-0.01em'
                                }}>
                                    订阅版
                                </h3>
                                <p style={{ color: '#71717a', fontSize: 16, marginBottom: 32, lineHeight: 1.6 }}>
                                    适合个人用户和短期项目
                                </p>
                                <div style={{ marginBottom: 32 }}>
                                    <span style={{
                                        fontSize: 56,
                                        fontWeight: 700,
                                        color: '#18181b',
                                        letterSpacing: '-2px'
                                    }}>
                                        ¥99
                                    </span>
                                    <span style={{ color: '#71717a', fontSize: 18, marginLeft: 8 }}>
                                        /年
                                    </span>
                                </div>
                            </div>

                            <div style={{ marginBottom: 40 }}>
                                {[
                                    '无限次 AI 生成',
                                    '100+ 精美模板',
                                    '导出 PNG/SVG',
                                    '在线编辑器',
                                    '品牌配色管理',
                                    '批量生成功能'
                                ].map((feature, idx) => (
                                    <div key={idx} style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 14,
                                        marginBottom: 16,
                                        color: '#52525b',
                                        fontSize: 16
                                    }}>
                                        <CheckOutlined style={{ color: '#3b82f6', fontSize: 18, flexShrink: 0 }} />
                                        <span>{feature}</span>
                                    </div>
                                ))}
                            </div>

                            <Button
                                type="primary"
                                size="large"
                                block
                                onClick={() => handlePurchase('subscription')}
                                style={{
                                    height: 56,
                                    borderRadius: 14,
                                    fontSize: 17,
                                    fontWeight: 600,
                                    background: 'linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%)',
                                    border: 'none',
                                    boxShadow: '0 4px 16px rgba(59, 130, 246, 0.3)',
                                    letterSpacing: '0.02em'
                                }}
                            >
                                立即订阅
                            </Button>
                        </Card>

                        {/* 买断版 */}
                        <Card
                            className="feature-card"
                            style={{
                                borderRadius: 28,
                                border: '2px solid #ff6b35',
                                boxShadow: '0 16px 56px rgba(255, 107, 53, 0.2)',
                                position: 'relative',
                                overflow: 'visible',
                                transform: 'scale(1.05)'
                            }}
                            bodyStyle={{ padding: 48 }}
                        >
                            <Tag
                                style={{
                                    position: 'absolute',
                                    top: -14,
                                    right: 32,
                                    background: 'linear-gradient(135deg, #ff6b35 0%, #ff8f5a 100%)',
                                    border: 'none',
                                    color: '#fff',
                                    padding: '6px 20px',
                                    fontSize: 14,
                                    fontWeight: 600,
                                    borderRadius: 100,
                                    boxShadow: '0 4px 16px rgba(255, 107, 53, 0.35)',
                                    letterSpacing: '0.05em'
                                }}
                            >
                                推荐
                            </Tag>

                            <div style={{ marginBottom: 32 }}>
                                <div style={{
                                    width: 64,
                                    height: 64,
                                    borderRadius: 18,
                                    background: 'linear-gradient(135deg, #ff6b35 0%, #ff8f5a 100%)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    marginBottom: 24,
                                    boxShadow: '0 8px 24px rgba(255, 107, 53, 0.3)'
                                }}>
                                    <CrownOutlined style={{ fontSize: 32, color: '#fff' }} />
                                </div>
                                <h3 style={{
                                    fontSize: 28,
                                    fontWeight: 700,
                                    color: '#18181b',
                                    marginBottom: 12,
                                    letterSpacing: '-0.01em'
                                }}>
                                    买断版
                                </h3>
                                <p style={{ color: '#71717a', fontSize: 16, marginBottom: 32, lineHeight: 1.6 }}>
                                    一次付费，永久使用
                                </p>
                                <div style={{ marginBottom: 32 }}>
                                    <span style={{
                                        fontSize: 56,
                                        fontWeight: 700,
                                        color: '#18181b',
                                        letterSpacing: '-2px'
                                    }}>
                                        ¥365
                                    </span>
                                    <span style={{ color: '#71717a', fontSize: 18, marginLeft: 8 }}>
                                        /永久
                                    </span>
                                    <div style={{
                                        display: 'inline-block',
                                        marginLeft: 16,
                                        padding: '4px 12px',
                                        background: 'rgba(255, 107, 53, 0.1)',
                                        borderRadius: 100,
                                        fontSize: 13,
                                        color: '#ff6b35',
                                        fontWeight: 600,
                                        letterSpacing: '0.02em'
                                    }}>
                                        省 ¥200+
                                    </div>
                                </div>
                            </div>

                            <div style={{ marginBottom: 40 }}>
                                {[
                                    '无限次 AI 生成',
                                    '100+ 精美模板',
                                    '导出 PNG/SVG',
                                    '在线编辑器',
                                    '品牌配色管理',
                                    '批量生成功能',
                                    '优先技术支持',
                                    '永久免费更新'
                                ].map((feature, idx) => (
                                    <div key={idx} style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 14,
                                        marginBottom: 16,
                                        color: '#52525b',
                                        fontSize: 16
                                    }}>
                                        <CheckOutlined style={{ color: '#ff6b35', fontSize: 18, flexShrink: 0 }} />
                                        <span>{feature}</span>
                                    </div>
                                ))}
                            </div>

                            <Button
                                type="primary"
                                size="large"
                                block
                                onClick={() => handlePurchase('lifetime')}
                                style={{
                                    height: 56,
                                    borderRadius: 14,
                                    fontSize: 17,
                                    fontWeight: 600,
                                    background: 'linear-gradient(135deg, #ff6b35 0%, #ff8f5a 100%)',
                                    border: 'none',
                                    boxShadow: '0 4px 16px rgba(255, 107, 53, 0.3)',
                                    letterSpacing: '0.02em'
                                }}
                            >
                                立即购买
                            </Button>
                        </Card>
                    </div>

                    {/* FAQ */}
                    <div style={{
                        marginTop: 100,
                        maxWidth: 900,
                        margin: '100px auto 0'
                    }}>
                        <h3 style={{
                            fontSize: 32,
                            fontWeight: 700,
                            color: '#18181b',
                            marginBottom: 48,
                            textAlign: 'center',
                            letterSpacing: '-0.01em'
                        }}>
                            常见问题
                        </h3>
                        <div style={{
                            display: 'grid',
                            gap: 24
                        }}>
                            {[
                                {
                                    q: '订阅版和买断版有什么区别？',
                                    a: '功能完全一样！订阅版按年付费（¥99/年），买断版一次付费永久使用（¥365），相当于 3.7 年订阅的价格，长期使用更划算。'
                                },
                                {
                                    q: '可以免费试用吗？',
                                    a: '可以！注册后即可免费生成 3 张信息图，体验完整功能。无需信用卡，立即开始。'
                                },
                                {
                                    q: '支持哪些支付方式？',
                                    a: '支持支付宝、微信支付、银行卡等多种支付方式，安全便捷。'
                                },
                                {
                                    q: '买断版是否包含未来更新？',
                                    a: '是的，买断版用户可以永久免费获得所有功能更新、新模板和技术支持，无任何隐藏费用。'
                                }
                            ].map((faq, idx) => (
                                <div key={idx} className="feature-card" style={{
                                    padding: '32px 40px',
                                    borderRadius: 20
                                }}>
                                    <h4 style={{
                                        fontSize: 18,
                                        fontWeight: 600,
                                        color: '#18181b',
                                        marginBottom: 12,
                                        letterSpacing: '-0.01em'
                                    }}>
                                        {faq.q}
                                    </h4>
                                    <p style={{
                                        fontSize: 16,
                                        color: '#71717a',
                                        margin: 0,
                                        lineHeight: 1.7,
                                        letterSpacing: '0.01em'
                                    }}>
                                        {faq.a}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* 最终 CTA */}
            <section style={{
                padding: '80px 32px 140px',
                position: 'relative',
                zIndex: 2
            }}>
                <div className="glass-card" style={{
                    maxWidth: 1000,
                    margin: '0 auto',
                    padding: '100px 80px',
                    borderRadius: 36,
                    textAlign: 'center',
                    background: 'rgba(255, 255, 255, 0.7)'
                }}>
                    <h2 style={{
                        fontSize: 'clamp(36px, 6vw, 56px)',
                        fontWeight: 700,
                        color: '#18181b',
                        marginBottom: 24,
                        letterSpacing: '-0.02em',
                        lineHeight: 1.15
                    }}>
                        准备好<span style={{ color: '#ff6b35' }}>开始创作</span>了吗？
                    </h2>
                    <p style={{
                        fontSize: 20,
                        color: '#71717a',
                        marginBottom: 48,
                        lineHeight: 1.7,
                        letterSpacing: '0.01em'
                    }}>
                        加入数千名创作者，用 AI 释放你的创意潜能
                    </p>
                    <div style={{ display: 'flex', gap: 16, justifyContent: 'center' }}>
                        <Button
                            type="primary"
                            size="large"
                            onClick={() => onStart()}
                            className="cta-primary"
                            style={{
                                height: 60,
                                padding: '0 48px',
                                fontSize: 17,
                                fontWeight: 600,
                                borderRadius: 14,
                                border: 'none'
                            }}
                        >
                            免费开始使用 <ArrowRightOutlined style={{ marginLeft: 10 }} />
                        </Button>
                        <Button
                            size="large"
                            icon={<PlayCircleOutlined />}
                            style={{
                                height: 60,
                                padding: '0 32px',
                                fontSize: 17,
                                fontWeight: 500,
                                borderRadius: 14,
                                border: '1px solid rgba(0,0,0,0.1)',
                                background: 'rgba(255,255,255,0.8)',
                                color: '#52525b'
                            }}
                        >
                            观看演示
                        </Button>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer style={{
                padding: '56px 32px',
                borderTop: '1px solid rgba(0, 0, 0, 0.05)',
                position: 'relative',
                zIndex: 2
            }}>
                <div style={{
                    maxWidth: 1200,
                    margin: '0 auto',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                        <div style={{
                            width: 40,
                            height: 40,
                            background: 'linear-gradient(135deg, #ff6b35 0%, #ff8f5a 100%)',
                            borderRadius: 12,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: 20,
                            color: '#fff'
                        }}>
                            <RobotOutlined />
                        </div>
                        <span style={{ 
                            fontSize: 18, 
                            fontWeight: 600, 
                            color: '#18181b',
                            letterSpacing: '-0.01em'
                        }}>
                            Infographic<span style={{ color: '#ff6b35' }}>AI</span>
                        </span>
                    </div>
                    <div style={{ 
                        fontSize: 14, 
                        color: '#a1a1aa',
                        letterSpacing: '0.01em'
                    }}>
                        © 2026 InfographicAI. 让创意可视化。
                    </div>
                </div>
            </footer>

            {/* 支付弹窗 */}
            <PaymentModal
                visible={paymentModalVisible}
                onClose={() => setPaymentModalVisible(false)}
                productType={selectedProduct}
            />
        </div>
    );
};

// 用户评价数据
const TESTIMONIALS = [
    { name: '张明', role: '产品经理', content: '以前做一张信息图要花半天，现在几分钟就搞定了，效率提升太明显了！', color: '#3b82f6' },
    { name: '李婷', role: '市场总监', content: '团队汇报再也不用担心设计问题，AI 生成的图表专业又美观。', color: '#8b5cf6' },
    { name: '王强', role: '创业者', content: '作为非设计背景的人，这个工具让我也能做出专业级的展示材料。', color: '#06b6d4' },
    { name: '陈雪', role: '咨询顾问', content: '客户提案的视觉效果提升了一个档次，成单率明显提高。', color: '#10b981' },
];

const TESTIMONIALS_2 = [
    { name: '刘洋', role: '数据分析师', content: '数据可视化从未如此简单，AI 理解我的需求比我想象的还准确。', color: '#f59e0b' },
    { name: '赵琳', role: '教育工作者', content: '课件制作效率翻倍，学生反馈说图表更容易理解了。', color: '#ec4899' },
    { name: '孙伟', role: '自媒体博主', content: '内容创作的好帮手，信息图让我的文章阅读量涨了不少。', color: '#14b8a6' },
    { name: '周敏', role: '项目经理', content: '项目汇报用的流程图、甘特图，几句话就能生成，太方便了。', color: '#6366f1' },
];

// 三步流程数据
const STEPS = [
    { icon: '💬', title: '描述想法', desc: '用自然语言描述你想要的信息图内容和风格', bg: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)' },
    { icon: '✨', title: 'AI 生成', desc: 'AI 理解你的需求，自动生成专业信息图', bg: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)' },
    { icon: '🎨', title: '编辑导出', desc: '可视化编辑调整，一键导出多种格式', bg: 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)' },
];

// 核心功能数据
const FEATURES = [
    { icon: '🤖', title: 'AI 智能理解', desc: '基于先进的大语言模型，准确理解你的描述意图，生成符合预期的信息图。', bg: 'linear-gradient(135deg, #ede9fe 0%, #ddd6fe 100%)' },
    { icon: '📐', title: '丰富模板库', desc: '内置数十种专业模板，涵盖流程图、组织架构、数据图表等多种类型。', bg: 'linear-gradient(135deg, #fce7f3 0%, #fbcfe8 100%)' },
    { icon: '🎯', title: '品牌配色', desc: '支持导入企业品牌色，一键应用到所有信息图，保持视觉统一。', bg: 'linear-gradient(135deg, #cffafe 0%, #a5f3fc 100%)' },
    { icon: '📤', title: '多格式导出', desc: '支持 PNG、SVG、PDF 等多种格式导出，满足不同场景需求。', bg: 'linear-gradient(135deg, #fef9c3 0%, #fef08a 100%)' },
];

export default LandingPage;
