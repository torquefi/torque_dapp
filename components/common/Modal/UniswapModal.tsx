import { useSelector } from 'react-redux'
import Modal from '.'
import { AppStore } from '@/types/store'
import { useEffect } from 'react'

export interface UniSwapModalProps {
    open: boolean
    handleClose: () => void
}

export default function UniSwapModal({ open, handleClose }: UniSwapModalProps) {
    const theme = useSelector((store: AppStore) => store.theme.theme)

    return (
        <Modal
            className="mx-auto w-[90%] max-w-[440px] bg-[#FCFAFF] dark:bg-[#030303] px-[0px] py-[1px]"
            open={open}
            handleClose={handleClose}
            hideCloseIcon
        >
            <iframe
                src={`https://app.uniswap.org/#/swap?inputCurrency=0x82aF49447D8a07e3bd95BD0d56f35241523fBab1&outputCurrency=0xb56c29413af8778977093b9b4947efeea7136c36&theme=${theme === 'light' ? 'light' : 'dark'}`}
                height="420px"
                width="100%"
                style={{ borderRadius: '24px', overflow: 'auto' }}
            />
        </Modal>
    )
}
