import { useState, useCallback } from 'react';
import { ConfigProvider, theme, message } from 'antd';
import { LandingPage } from './LandingPage';
import { ProductApp } from './ProductApp';
import { ActivationModal } from './components/ActivationModal';
import { PaymentModal } from './components/PaymentModal';
import { canUse, incrementUsageCount, getUsageInfo, getLicenseInfo } from './services/license';

export function App() {
    const [showApp, setShowApp] = useState(false);
    const [initialPrompt, setInitialPrompt] = useState('');
    const [showActivationModal, setShowActivationModal] = useState(false);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<'subscription' | 'lifetime'>('subscription');

    const handleStart = (prompt?: string) => {
        if (prompt) {
            setInitialPrompt(prompt);
        }
        setShowApp(true);
    };

    const handleGenerate = useCallback(() => {
        // 检查是否可以使用
        if (!canUse()) {
            setShowActivationModal(true);
            return false;
        }

        // 如果未激活，增加使用次数
        const license = getLicenseInfo();
        if (!license.activated) {
            incrementUsageCount();
            const usage = getUsageInfo();
            
            if (usage.remaining > 0) {
                message.info(`剩余免费次数：${usage.remaining} 次`);
            } else {
                // 最后一次使用后显示激活提示
                setTimeout(() => {
                    setShowActivationModal(true);
                }, 1000);
            }
        }

        return true;
    }, []);

    const handleActivated = () => {
        message.success('激活成功！现在可以无限制使用了');
    };

    const handlePurchase = (type: 'subscription' | 'lifetime') => {
        setSelectedProduct(type);
        setShowPaymentModal(true);
    };

    if (showApp) {
        return (
            <>
                <ProductApp initialPrompt={initialPrompt} onGenerate={handleGenerate} />
                
                <ActivationModal
                    visible={showActivationModal}
                    onClose={() => setShowActivationModal(false)}
                    onActivated={handleActivated}
                    onPurchase={handlePurchase}
                />

                <PaymentModal
                    visible={showPaymentModal}
                    onClose={() => setShowPaymentModal(false)}
                    productType={selectedProduct}
                />
            </>
        );
    }

    return (
        <ConfigProvider
            theme={{
                algorithm: theme.defaultAlgorithm,
                token: {
                    colorPrimary: '#ff6b35',
                },
            }}
        >
            <LandingPage onStart={handleStart} />
        </ConfigProvider>
    );
}

export default App;
