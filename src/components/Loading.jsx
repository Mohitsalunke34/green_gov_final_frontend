export default function Loading({ message = "Loading..." }) {
    return (
        <div className="d-flex justify-content-center align-items-center py-5">
            <div className="spinner-border text-primary me-2" role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
            <span>{message}</span>
        </div>
    );
}
