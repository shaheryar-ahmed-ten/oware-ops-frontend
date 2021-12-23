import { Grid, Paper, Typography, makeStyles, Button } from "@material-ui/core";
import React from "react";

const useStyles = makeStyles((theme) => ({
  root: {
    marginBottom: "3px",
    boxShadow: "0 5px 5px -5px rgba(0, 0, 0, 1)",
  },
  pageHeader: {
    padding: theme.spacing(2),
    display: "flex",
    paddingBottom: 0,
  },
  val: {
    fontWeight: "bolder",
  },
}));

function TableStatsHeader({ stats, setCurrentFilter, currentFilter, setTotalProducts }) {
  const classes = useStyles();
  return (
    <React.Fragment>
      <Paper elevation={0} square className={classes.root}>
        <div className={classes.pageHeader}>
          <Grid container justify="flex-start" spacing={1}>
            {stats.map((stat, i) => {
              return (
                <Grid item key={stat.key}>
                  <Button
                    key={stat.key}
                    variant="contained"
                    onClick={(e) => {
                      setCurrentFilter(stat.key);
                      setTotalProducts(stat.value);
                    }}
                    color={stat.key === currentFilter ? "primary" : "defualt"}
                  >
                    {stat.label}
                    &nbsp;
                    <strong>({stat.value})</strong>
                  </Button>
                </Grid>
              );
            })}
          </Grid>
        </div>
      </Paper>
    </React.Fragment>
  );
}

export default TableStatsHeader;
