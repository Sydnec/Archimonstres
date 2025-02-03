import Link from 'next/link';
import '../styles/navbar.css';

export default function Navbar() {
    return (
        <nav className="navbar">
            <ul>
                <li>
                    <Link href="/monsters">Monstres</Link>
                </li>
                <li>
                    <Link href="/kralamour">Kralamour</Link>
                </li>
                <li>
                    <Link href="/etapes">Étapes</Link>
                </li>
                <li>
                    <Link href="/communaute">Communauté</Link>
                </li>
                <li>
                    <Link href="/api-keys">Clef API</Link>
                </li>
            </ul>
        </nav>
    );
}
