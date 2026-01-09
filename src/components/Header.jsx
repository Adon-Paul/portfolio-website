import React from 'react';

export default function Header({ visible }) {
    return (
        <header className={`app-header ${visible ? 'visible' : ''}`}>
            <div className="brand-name">Adon Paul Tomy</div>

            <nav className="header-nav">
                <a href="#about">About Me</a>
                <a href="#projects">Projects</a>
                <a href="#interesting">Interesting Stuff</a>
            </nav>
        </header>
    );
}
