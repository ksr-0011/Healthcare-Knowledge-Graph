// Import necessary dependencies
import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Grid,
  Card,
  CardContent,
  Button,
} from '@mui/material';
// import Image from 'material-ui-image';

// Define the main landing page component
const LandingPage = () => {
  return (
    <div>
      {/* App Bar */}
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6">Dr. Data</Typography>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Container>
        {/* Hero Section */}
        <Grid container spacing={2}>
      {/* Text Section (Left) */}
      <Grid item xs={12} sm={6} style={{ textAlign: 'left' }}>
        <Typography variant="h3" style={{ marginTop: '20px' }}>
          Knowledge Graphs
        </Typography>
        <Typography variant="body1" color="textSecondary">
          {/* Your detailed text here */}
          A knowledge graph is a dynamic system that organizes information using graph structures. Entities and their relationships are represented as nodes and edges, facilitating advanced data analysis and automated reasoning in various domains.
        </Typography>
      </Grid>

      {/* Image Section (Right) */}
      <Grid item xs={12} sm={6} style={{ textAlign: 'right' }}>
        <img
          src="https://www.stardog.com/img/hiw/based-on-graph.gif?_cchid=e3e923b72d9d7382a58a565ad431ae46"
          alt="Graph"
          style={{ width: '100%', height: 'auto' }}
        />
      </Grid>
    </Grid>

    






        <Grid container spacing={3} style={{ marginTop: '20px' }}>
          {/* Knowledge Graph Card */}
          <Grid item xs={12} sm={6} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6">Preset Diabetes </Typography>
                <Typography variant="body2" color="textSecondary">
                  Explore the conceptual connection between the general medical chart , general heart stroke data and general diabetic data
                </Typography>
                <Button variant="contained" color="primary" href="/table">
                  Get Started
                </Button>    
              </CardContent>
            </Card>
          </Grid>

          {/* Features Card */}
          <Grid item xs={12} sm={6} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6">Preset Heart Disease</Typography>
                <Typography variant="body2" color="textSecondary">
                Explore the conceptual connection between the general medical chart , general heart stroke data and general diseases and prescription data 
                </Typography>
                <Button variant="contained" color="primary" href="/table2">
                  Get Started
                </Button>
              </CardContent>
            </Card>
          </Grid>

          {/* Contact Card */}
          <Grid item xs={12} sm={6} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6">Preset Oral Cancer</Typography>
                <Typography variant="body2" color="textSecondary">
                Explore the conceptual connection between the general heart stroke, diabetic data ,oral cancer and diseases & prescription data 
                </Typography>
                <Button variant="contained" color="primary" href="/table3">
                  Get Started
                </Button>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6">Heart Stroke ?</Typography>
                <Typography variant="body2" color="textSecondary">
                Visualisation of Age with Heart Disease and Smoking Habits 
                </Typography>
                <Button variant="contained" color="primary" href="/d3">
                  Get Started
                </Button>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6">Diabetes ?</Typography>
                <Typography variant="body2" color="textSecondary">
                Visualisation of Age with Diabetes Correlation with family history and glucose levels 
                </Typography>
                <Button variant="contained" color="primary" href="/diabetesage">
                  Get Started
                </Button>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6">Custom Heart</Typography>
                <Typography variant="body2" color="textSecondary">
                  Enter Your Info and explore the heart stroke dataset
                </Typography>
                <Button variant="contained" color="primary" href="/form">
                  Get Started
                </Button>    
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6">Custom Diabetes and Disease</Typography>
                <Typography variant="body2" color="textSecondary">
                Enter Your Info and explore the diseases dataset intercorrelated with diabetes data
                </Typography>
                <Button variant="contained" color="primary" href="/form2">
                  Get Started
                </Button>    
              </CardContent>
            </Card>
          </Grid>

        </Grid>
      </Container>
    </div>
  );
};

export default LandingPage;
