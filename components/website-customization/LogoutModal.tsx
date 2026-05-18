import { useAuth } from '@/lib/auth-context';
import { Modal } from './shared/Modal';
import { useState } from 'react';
import { toast } from 'sonner';

interface Props {
    open: boolean;
    onClose: () => void
}

const LogoutModal = ({ open, onClose }: Props) => {
    const { logout } = useAuth();

    const [loading, setLoading] = useState<boolean>(false);

    const handleLogout = async () => {
        setLoading(true);

        try {
            await logout();
        }
        catch(error: any) {
            toast.error(error instanceof Error ? error.message : 'Logout failed. Retry again...');
        }
        finally {
            setLoading(false)
        }
    }
    
    return (
        <Modal open={open} onClose={onClose} title='Logout'>
            <div className="flex gap-3 pt-1">
                <button 
                    type="button" 
                    className="btn primary flex-1" 
                    disabled={loading}
                    onClick={handleLogout}
                >
                    {loading ? 'Logging Out' : 'Logout'}
                </button>
                <button type="button" className="btn flex-1" onClick={onClose}>Cancel</button>
            </div>
        </Modal>
    )
}

export default LogoutModal