import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import CreateReportButton from './CreateReportButton';
import CreateReportBox from './CreateReportBox';

export default function CreateReport() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <>
            <Outlet />
            <CreateReportButton onClick={() => setIsModalOpen(true)} />
            
                <CreateReportBox
                    open={isModalOpen}
                    handleClose={() => setIsModalOpen(false)}
                />
            
        </>
    );
}