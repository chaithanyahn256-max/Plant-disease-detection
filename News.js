import Slider from "../../components/slider/Slider";
import diseases from "../../diseases.js";
import DiseaseCard from "../../components/diseaseCard/DiseaseCard.js";
import { Box, SimpleGrid, Heading } from "@chakra-ui/react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./News.css";
import { useState } from "react";
import { Container } from "react-bootstrap";

// Background style with glass effect
const backgroundStyle = {
  backgroundImage: 'url("https://static.vecteezy.com/system/resources/previews/007/950/886/large_2x/small-plant-growing-in-morning-light-at-garden-concept-earth-day-free-photo.jpg")',
  backgroundSize: 'cover',
  backgroundAttachment: 'fixed',
  backgroundPosition: 'center',
  minHeight: '100vh',
  padding: '20px 0',
  position: 'relative',
};

// Glass card style
const glassCard = {
  background: "rgba(255, 255, 255, 0.1)",
  backdropFilter: "blur(10px)",
  WebkitBackdropFilter: "blur(10px)",
  border: "1px solid rgba(255, 255, 255, 0.2)",
  boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.2)",
  color: "white",
  borderRadius: "2xl",
};

const News = () => {
  const [plantName, setPlantName] = useState("");

  return (
    <div style={backgroundStyle}>
      {/* Dark overlay for background */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.4)',
        zIndex: 1,
      }} />
      
      <Container style={{ position: 'relative', zIndex: 2 }}>
        {/* White overlay panel - now with glass effect */}
        <Box
          style={{
            ...glassCard,
            padding: '2rem',
          }}
        >
          <Slider />
          
          {/* Page Title */}
          <Box mb={4} textAlign="center">
            <Heading as="h2" size="lg" color="white" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>
              🌿 Plant Diseases Library
            </Heading>
          </Box>

          {/* Search input with glass effect */}
          <Box mb={4} textAlign="center">
            <input
              type="text"
              placeholder="Search by plant name..."
              value={plantName}
              onChange={(e) => setPlantName(e.target.value)}
              style={{
                padding: '12px 20px',
                borderRadius: '30px',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(5px)',
                WebkitBackdropFilter: 'blur(5px)',
                color: 'white',
                width: '300px',
                maxWidth: '100%',
                outline: 'none',
              }}
              onFocus={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.2)'}
              onBlur={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.1)'}
            />
          </Box>

          {/* Disease cards grid - full width */}
          <SimpleGrid
            columns={{ sm: 1, md: 2, lg: 3 }}
            spacing="30px"
            className="newsContent"
            width="100%"
          >
            {diseases.map((disease) => {
              if (disease.plantName === plantName || plantName === "") {
                return (
                  <Box
                    className="newsBox"
                    key={disease.key}
                    style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      backdropFilter: 'blur(8px)',
                      WebkitBackdropFilter: 'blur(8px)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '1rem',
                      overflow: 'hidden',
                      transition: 'transform 0.3s ease',
                    }}
                    _hover={{ transform: 'translateY(-5px)' }}
                  >
                    <DiseaseCard data={disease} />
                  </Box>
                );
              }
              return null;
            })}
          </SimpleGrid>
        </Box>
      </Container>
    </div>
  );
};

export default News;