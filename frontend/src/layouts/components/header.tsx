import { Link } from 'react-router-dom';
import { AuthModal } from '@/components/auth/AuthModal';

const Header: React.FC = () => {
    return (
        <>
            <header className="px-6 h-16 flex items-center justify-between border-b border-slate-200 bg-white shadow-sm">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-600 rounded-md flex items-center justify-center">
                        <span className="text-white font-bold text-lg">T</span>
                    </div>
                    <Link to="/" className="text-xl font-bold text-slate-800 tracking-tight">TrelloClone</Link>
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-4">
                        <AuthModal />
                    </div>
                </div>
            </header>
        </>
    )
}

export default Header;