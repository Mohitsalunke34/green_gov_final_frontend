export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-success text-white py-4 mt-auto">
            <div className="container-fluid px-4">
                <div className="row">
                    <div className="col-md-4 mb-3 mb-md-0">
                        <h6 className="fw-bold mb-1">GreenGov</h6>
                        <p className="small text-white-50 mb-0">
                            Government Green Initiatives Platform
                        </p>
                    </div>
                    <div className="col-md-4 mb-3 mb-md-0">
                        <h6 className="fw-bold mb-2">Quick Links</h6>
                        <ul className="list-unstyled small mb-0">
                            <li><a href="/programs"    className="text-white-50 text-decoration-none">Programs</a></li>
                            <li><a href="/projects"    className="text-white-50 text-decoration-none">Projects</a></li>
                            <li><a href="/incentives"  className="text-white-50 text-decoration-none">Incentives</a></li>
                            <li><a href="/compliance"  className="text-white-50 text-decoration-none">Compliance</a></li>
                        </ul>
                    </div>
                    <div className="col-md-4">
                        <h6 className="fw-bold mb-2">Contact</h6>
                        <p className="small text-white-50 mb-1">support@greengov.gov.in</p>
                        <p className="small text-white-50 mb-0">1800-GREEN-GOV</p>
                    </div>
                </div>
                <hr className="border-white border-opacity-25 my-3" />
                <p className="text-center small text-white-50 mb-0">
                    &copy; {currentYear} GreenGov — Ministry of Environment, Government of India
                </p>
            </div>
        </footer>
    );
}
