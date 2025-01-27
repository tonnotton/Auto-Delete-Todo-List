'use client'
import { useState } from 'react';
import { Button, Container, Grid, Paper, Typography, Box } from '@mui/material';
import { v4 as uuidv4 } from 'uuid';
import { motion, AnimatePresence } from 'framer-motion';

const createInitialItems = () => [
  { id: uuidv4(), type: 'Fruit', name: 'Apple' },
  { id: uuidv4(), type: 'Vegetable', name: 'Broccoli' },
  { id: uuidv4(), type: 'Vegetable', name: 'Mushroom' },
  { id: uuidv4(), type: 'Fruit', name: 'Banana' },
  { id: uuidv4(), type: 'Vegetable', name: 'Tomato' },
  { id: uuidv4(), type: 'Fruit', name: 'Orange' },
  { id: uuidv4(), type: 'Fruit', name: 'Mango' },
  { id: uuidv4(), type: 'Fruit', name: 'Pineapple' },
  { id: uuidv4(), type: 'Vegetable', name: 'Cucumber' },
  { id: uuidv4(), type: 'Fruit', name: 'Watermelon' },
  { id: uuidv4(), type: 'Vegetable', name: 'Carrot' },
];

const ItemButton = ({ item, onClick, timeLeft, isMainList }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    style={{ width: '100%' }}
  >
    <Button
      variant="contained"
      onClick={() => onClick(item)}
      fullWidth
      sx={{
        textTransform: 'none',
        borderRadius: '12px',
        background: 'linear-gradient(90deg, #34d399, #10b981)',
        color: '#ffffff',
        padding: '12px 18px',
        justifyContent: 'space-between',
        minWidth: '200px',
        fontWeight: 600,
        fontSize: '1rem',
        transition: 'transform 0.2s ease, background 0.2s ease',
        '&:hover': {
          background: 'linear-gradient(90deg, #10b981, #059669)',
          transform: 'scale(1.05)',
        },
      }}
    >
      <span>{item.name}</span>
      {!isMainList && timeLeft != null && (
        <span style={{ marginLeft: '8px', fontSize: '0.85em', color: '#d1fae5' }}>
          {Math.max(0, Math.ceil(timeLeft / 1000))}s
        </span>
      )}
    </Button>
  </motion.div>
);

export default function Home() {
  const [mainList, setMainList] = useState(createInitialItems());
  const [fruitList, setFruitList] = useState([]);
  const [vegetableList, setVegetableList] = useState([]);
  const [timeouts, setTimeouts] = useState({});
  const [timers, setTimers] = useState({});

  const moveToTypeList = (item) => {
    if (timeouts[item.id]) {
      clearTimeout(timeouts[item.id]);
      clearInterval(timers[item.id]);
    }

    setMainList((prev) => prev.filter((i) => i.id !== item.id));

    let startTime = Date.now();
    const timerInterval = setInterval(() => {
      const timeLeft = 5000 - (Date.now() - startTime);
      if (timeLeft <= 0) {
        clearInterval(timerInterval);
      }
      setTimers((prev) => ({ ...prev, [item.id]: timeLeft }));
    }, 100);

    if (item.type === 'Fruit') {
      setFruitList((prev) => [...prev, item]);
    } else {
      setVegetableList((prev) => [...prev, item]);
    }

    const timeout = setTimeout(() => {
      moveBackToMain(item);
    }, 5000);

    setTimeouts((prev) => ({
      ...prev,
      [item.id]: timeout,
    }));
  };

  const moveBackToMain = (item) => {
    if (timeouts[item.id]) {
      clearTimeout(timeouts[item.id]);
      clearInterval(timers[item.id]);
      setTimeouts((prev) => {
        const newTimeouts = { ...prev };
        delete newTimeouts[item.id];
        return newTimeouts;
      });
      setTimers((prev) => {
        const newTimers = { ...prev };
        delete newTimers[item.id];
        return newTimers;
      });
    }

    if (item.type === 'Fruit') {
      setFruitList((prev) => prev.filter((i) => i.id !== item.id));
    } else {
      setVegetableList((prev) => prev.filter((i) => i.id !== item.id));
    }
    setMainList((prev) => [...prev, item]);
  };

  return (
    <Box
      className="min-h-screen py-8"
      sx={{
        padding: '16px',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {[{
            title: 'Main List',
            list: mainList,
            handler: moveToTypeList,
            isMainList: true
          }, {
            title: 'Fruit',
            list: fruitList,
            handler: moveBackToMain,
            isMainList: false
          }, {
            title: 'Vegetable',
            list: vegetableList,
            handler: moveBackToMain,
            isMainList: false
          }].map(({ title, list, handler, isMainList }, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Paper
                elevation={3}
                sx={{
                  padding: '16px',
                  borderRadius: '16px',
                  background: '#ffffff',
                  boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    textAlign: 'center',
                    marginBottom: '12px',
                    fontWeight: 600,
                    fontSize: '1.2rem',
                    color: '#065f46',
                  }}
                >
                  {title}
                </Typography>
                <AnimatePresence mode="popLayout">
                  <div style={{ padding: '8px 0' }}>
                    {list.map((item) => (
                      <Box sx={{ marginBottom: '8px' }} key={item.id}>
                        <ItemButton
                          item={item}
                          onClick={handler}
                          timeLeft={timers[item.id]}
                          isMainList={isMainList}
                        />
                      </Box>
                    ))}
                  </div>
                </AnimatePresence>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}