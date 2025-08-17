import React from "react";
import "./App.css";
import { BrowserRouter } from "react-router-dom";
import Navigation from "./components/Navigation";
import HeroSection from "./components/HeroSection";
import AboutSection from "./components/AboutSection";
import VotingSection from "./components/VotingSection";
import SubmissionSection from "./components/SubmissionSection";
import GallerySection from "./components/GallerySection";
import Footer from "./components/Footer";
import { Toaster } from "./components/ui/sonner";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Navigation />
        <main>
          <HeroSection />
          <AboutSection />
          <VotingSection />
          <SubmissionSection />
          <GallerySection />
        </main>
        <Footer />
        <Toaster />
      </BrowserRouter>
    </div>
  );
}

export default App;