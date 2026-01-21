import React from 'react';
import { Link } from 'react-router-dom';

const Help = () => {
    const currentYear = new Date().getFullYear();

    return (
        <section className="bg-slate-900  text-slate-300 py-50 border-t border-slate-800">
            {/* Added max-w-6xl to prevent stretching on wide screens */}
            <div className="container mx-auto px-4 max-w-6xl">

                {/* Header Section */}
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                        How can we <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-400">help you?</span>
                    </h2>
                    <p className="text-slate-400 max-w-xl mx-auto text-lg">
                        Find answers, contact our support team, or browse our documentation.
                    </p>
                </div>

                {/* CHANGED: Grid is now 3 equal columns on large screens */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

                    {/* Column 1: Direct Support (Now compact and equal height) */}
                    <div className="bg-slate-800/50 p-8 rounded-2xl border border-slate-700/50 hover:border-blue-500/30 transition-all flex flex-col">
                        <div className="mb-6">
                            <span className="inline-block p-3 rounded-lg bg-blue-500/10 mb-4">
                                <svg className="w-8 h-8 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                                </svg>
                            </span>
                            <h3 className="text-white text-xl font-bold">Need Support?</h3>
                            <p className="text-slate-400 mt-2 text-sm leading-relaxed">
                                Our support team is available 24/7.
                            </p>
                        </div>

                        {/* Buttons pushed to bottom */}
                        <div className="mt-auto space-y-3">
                            <a href="mailto:mayurborse7440@gmail.com" className="block w-full text-center py-2.5 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-all">
                                Email Support
                            </a>
                            <Link to="/live-chat" className="block w-full text-center py-2.5 rounded-lg bg-slate-700 text-white font-medium hover:bg-slate-600 transition-all">
                                Start Live Chat
                            </Link>
                        </div>
                    </div>

                    {/* Column 2: Resources */}
                    <div className="md:pl-8"> {/* Added padding-left for spacing */}
                        <h3 className="text-white text-lg font-semibold mb-6 flex items-center gap-2">
                            <span className="w-1.5 h-6 bg-blue-500 rounded-full"></span>
                            Resources
                        </h3>
                        <ul className="space-y-4">
                            {[
                                { name: 'Getting Started Guide', path: '#' }, //'/help/start' },
                                { name: 'API Documentation', path: '#' }, //'/docs/api' },
                                { name: 'Account Settings', path: '#' },    //'/help/account' },
                                { name: 'Privacy & Security', path: '#' },  //'/help/security' }
                            ].map((link) => (
                                <li key={link.name}>
                                    <Link
                                        to={link.path}
                                        className="group flex items-center gap-3 text-slate-400 hover:text-blue-400 transition-colors"
                                    >
                                        <span className="w-1.5 h-1.5 rounded-full bg-slate-600 group-hover:bg-blue-400 transition-colors"></span>
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Column 3: Community */}
                    <div>
                        <h3 className="text-white text-lg font-semibold mb-6 flex items-center gap-2">
                            <span className="w-1.5 h-6 bg-teal-500 rounded-full"></span>
                            Community
                        </h3>
                        <ul className="space-y-4">
                            <li>
                                <Link to="#" className="group flex items-center gap-3 text-slate-400 hover:text-teal-400 transition-colors">
                                    <span className="w-1.5 h-1.5 rounded-full bg-slate-600 group-hover:bg-teal-400 transition-colors"></span>
                                    Freq. Asked Questions
                                </Link>
                            </li>
                            <li>
                                <Link to="#" className="group flex items-center gap-3 text-slate-400 hover:text-teal-400 transition-colors">
                                    <span className="w-1.5 h-1.5 rounded-full bg-slate-600 group-hover:bg-teal-400 transition-colors"></span>
                                    Community Forum
                                </Link>
                            </li>
                            <li>
                                <a href="#" className="group flex items-center gap-3 text-slate-400 hover:text-teal-400 transition-colors">
                                    <span className="w-1.5 h-1.5 rounded-full bg-slate-600 group-hover:bg-teal-400 transition-colors"></span>
                                    Join Discord Server
                                </a>
                            </li>
                            <li>
                                <Link to="#" className="flex items-center gap-3 px-4 py-2 rounded bg-slate-800/50 border border-slate-700 hover:border-green-500/50 transition-colors w-fit">
                                    <span className="relative flex h-2 w-2">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                                    </span>
                                    <span className="text-sm font-medium text-green-400">System Operational</span>
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-slate-800 mt-16 pt-8 text-center text-sm text-slate-500">
                    <p>&copy; {currentYear} The Dev Hub Support Team.</p>
                </div>
            </div>
        </section>
    );
};

export default Help;