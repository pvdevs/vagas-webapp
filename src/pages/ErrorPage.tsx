import { Link } from 'react-router-dom';

export default function ErrorPage() {
    return (
        <main>
            <h1>Esta página não existe </h1>
            <h1>Esta pagina esta sendo alterada para teste</h1>
            <div style={{ padding: '1rem 0' }}></div>
            <Link to="/">Voltar para Tela Inicial?</Link>
        </main>
    );
}
