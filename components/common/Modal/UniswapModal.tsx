import { useSelector } from 'react-redux'
import Modal from '.'
import { AppStore } from '@/types/store'

export interface UniSwapModalProps {
    open: boolean
    handleClose: () => void
}

export default function UniSwapModal({ open, handleClose }: UniSwapModalProps) {
    const theme = useSelector((store: AppStore) => store.theme.theme)

    return (
        <Modal
            className="mx-auto w-[90%] max-w-[440px] bg-[#FCFAFF] px-[18px] dark:bg-[#030303]"
            open={open}
            handleClose={handleClose}
            hideCloseIcon
        >
            <iframe
                src={`https://app.uniswap.org/#/swap?outputCurrency=0xb56c29413af8778977093b9b4947efeea7136c36&theme=${theme === 'light' ? 'light' : 'dark'}`}
                height="660px"
                width="100%"
            />
        </Modal>
    )
}
