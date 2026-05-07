export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-dark text-white mt-5 py-4">
            <div className="container-fluid">
                <div className="row">
                    <div className="col-md-4 mb-3 mb-md-0">
                        <h6 className="fw-bold">🌱 GreenGov</h6>
                        <p className="small text-muted">
                            Government Green Initiatives Platform
                        </p>
                    </div>
                    <div className="col-md-4 mb-3 mb-md-0">
                        <h6 className="fw-bold">Quick Links</h6>
                        <ul className="list-unstyled small">
                            <li><a href="/programs" className="text-decoration-none text-muted">Programs</a></li>
                            <li><a href="/projects" className="text-decoration-none text-muted">Projects</a></li>
                            <li><a href="/incentives" className="text-decoration-none text-muted">Incentives</a></li>
                        </ul>
                    </div>
                    <div className="col-md-4">
                        <h6 className="fw-bold">Contact</h6>
                        <p className="small text-muted mb-0">
                            📧 support@greengov.gov.in
                        </p>
                        <p className="small text-muted">
                            📞 1800-GREEN-GOV
                        </p>
                    </div>
                </div>
                <hr className="bg-secondary" />
                <div className="text-center small text-muted">
                    <p className="mb-0">
                        &copy; {currentYear} GreenGov. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}
