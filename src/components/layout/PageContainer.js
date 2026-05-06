export default function PageContainer({ title, children }) {
    return (
        <div className="container mt-5">
            {title && (
                <>
                    <h3 className="mb-3">{title}</h3>
                    <hr />
                </>
            )}
            {children}
        </div>
    );
}