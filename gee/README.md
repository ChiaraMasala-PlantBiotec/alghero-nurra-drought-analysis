# Alghero–Nurra Drought Analysis (2020–2025)

## Project Overview
This project explores the relationship between vegetation dynamics and climatic conditions in the Alghero–Nurra area of Sardinia, Italy, from January 2020 to December 2025.
The analysis uses monthly Normalized Difference Vegetation Index (NDVI) data and climate variables to investigate whether vegetation anomalies are associated with precipitation, temperature, and soil moisture anomalies. It also examines delayed relationships, seasonal differences, and the sensitivity of the precipitation–NDVI relationship to an unusually low NDVI observation.

## Objectives
- Explore monthly vegetation and climate patterns.
- Calculate monthly anomalies to compare observations with the average for the same calendar month.
- Assess contemporaneous correlations between NDVI anomalies and climate anomalies.
- Investigate one-month and two-month precipitation lags.
- Compare lagged climate–NDVI relationships across meteorological seasons.
- Evaluate the sensitivity of the precipitation–NDVI correlation to October 2023.

## Study Area
The study area is located in the Alghero–Nurra region of northwestern Sardinia, Italy. The analysis uses a polygon defined in Google Earth Engine to delimit the area over which vegetation and climate variables are extracted.
The polygon is defined by the following vertices (longitude, latitude; WGS 84):
```text
(8.2139545, 40.6692440)
(8.2002216, 40.6369459)
(8.3643299, 40.5769969)
(8.4069019, 40.6291295)
(8.2139545, 40.6692440)
```
The first vertex is repeated at the end to close the polygon. The geometry is defined in the Google Earth Engine JavaScript script and is used for spatial filtering and regional data extraction.

## Data
The analysis covers 72 monthly records from January 2020 to December 2025.
The datasets contain the following variables:
| Variable | Description |
|---|---|
| NDVI | Monthly mean vegetation index |
| Precipitation | Monthly precipitation (mm) |
| Temperature | Monthly mean temperature (°C) |
| Soil moisture | Monthly soil moisture |

Two CSV files are used:
- `Alghero_Nurra_Monthly_NDVI_2020_2025.csv`
- `Alghero_Nurra_Monthly_Climate_2020_2025.csv`

The datasets are merged by date, year, and month. Monthly continuity is checked, and missing values are inspected before the analysis.
Two months have missing NDVI values: December 2020 and March 2024. Consequently, the number of valid observations varies between analyses.

## Google Earth Engine and Data Extraction
Google Earth Engine (GEE) was used to process satellite imagery and climate data and export monthly datasets for the Alghero–Nurra study area for the period January 2020–December 2025.

### Sentinel-2 NDVI
Sentinel-2 Surface Reflectance imagery was retrieved from the `COPERNICUS/S2_SR_HARMONIZED` collection. Images were filtered by the study area, acquisition dates, and a scene-level cloud cover threshold of less than 20%.
Clouds and shadows were masked using the Scene Classification Layer (SCL). The Normalized Difference Vegetation Index (NDVI) was then calculated from the near-infrared (B8) and red (B4) bands. Monthly median composites were generated, and the mean NDVI was extracted over the study area for each month.

### ERA5-Land Climate Variables
Monthly climate data were obtained from the `ECMWF/ERA5_LAND/MONTHLY_AGGR` collection. Three variables were extracted over the same study area:
- **Precipitation:** monthly total precipitation, converted from metres to millimetres.
- **Temperature:** monthly mean 2 m air temperature, converted from kelvin to degrees Celsius.
- **Soil moisture:** volumetric soil water content in the first soil layer.
Regional mean values were calculated using spatial reduction over the study polygon.

### Study Area and Export
The study area was defined as a polygon in Google Earth Engine, using longitude and latitude coordinates in WGS 84. The same geometry was used to filter the satellite and climate collections and extract regional statistics.
The resulting monthly NDVI and climate tables were exported separately as CSV files:
- `Alghero_Nurra_Monthly_NDVI_2020_2025.csv`
- `Alghero_Nurra_Monthly_Climate_2020_2025.csv`
These datasets were subsequently used in Python for data preparation, monthly anomaly calculations, contemporaneous and lagged correlation analysis, seasonal comparisons, and sensitivity analysis.
The Google Earth Engine JavaScript script is included in the repository to document the data extraction workflow and support reproducibility.

## Methodology

### 1. Exploratory data analysis
Monthly time series are plotted for NDVI, precipitation, temperature, and soil moisture. The analysis also checks data types, missing values, descriptive statistics, and temporal coverage.

### 2. Monthly anomaly calculation
For each variable, anomalies are calculated by subtracting the mean for the corresponding calendar month across the study period.
This approach helps compare a month's conditions with the average conditions observed for that same month in other years.

### 3. Contemporaneous correlations
Pearson correlation coefficients and p-values are calculated to assess linear associations between NDVI anomalies and precipitation, temperature, and soil moisture anomalies from the same month.

### 4. Lagged correlations
Climate anomalies from the previous month are compared with current NDVI anomalies. Precipitation is also examined at a two-month lag.
Pearson correlation coefficients, p-values, and R-squared values are reported, alongside scatter plots and correlation comparisons.

### 5. Seasonal analysis
Lag-one-month correlations are calculated separately for winter, spring, summer, and autumn. Precipitation, temperature, and soil moisture are included to investigate whether the observed relationships vary across seasons.

### 6. Sensitivity analysis
October 2023 is examined because it has the lowest NDVI anomaly in the dataset. The lag-one-month precipitation correlation is recalculated after excluding this observation to assess how strongly it affects the overall relationship.

## Results

### Contemporaneous relationships
Soil moisture shows the strongest positive contemporaneous correlation with NDVI anomalies (*r* = 0.469, *p* < 0.001). Temperature shows a weaker negative correlation (*r* = −0.248, *p* = 0.038), while precipitation has a weak, non-significant positive correlation (*r* = 0.182, *p* = 0.132).

### Lagged relationships
The strongest overall lagged association is found between precipitation anomalies from the previous month and current NDVI anomalies:
- **One-month precipitation lag:** *r* = 0.424, *p* < 0.001.
- **Two-month precipitation lag:** *r* = 0.196, *p* = 0.110.

The one-month lag explains approximately 18% of the observed variance in NDVI anomalies in a simple linear relationship (R² = 0.180).
For the other climate variables at a one-month lag, soil moisture has a positive correlation with NDVI anomalies (*r* = 0.357, *p* = 0.003), whereas temperature has a weak, non-significant negative correlation (*r* = −0.179, *p* = 0.142).

### Seasonal patterns
The seasonal analysis reveals differences in the strength of the lagged relationships.
- **Precipitation:** positive correlations are strongest in autumn (*r* = 0.689, *p* = 0.002) and summer (*r* = 0.612, *p* = 0.007).
- **Soil moisture:** positive correlations are statistically significant in spring (*r* = 0.546, *p* = 0.023) and summer (*r* = 0.504, *p* = 0.033).
- **Temperature:** negative correlations are observed in summer and autumn, but they do not reach the 0.05 significance threshold in this analysis.
These results suggest that associations between vegetation anomalies and climate conditions may differ depending on the season.

### Sensitivity analysis: October 2023
October 2023 has an NDVI anomaly of approximately −0.138, the lowest value in the study period.
After excluding this observation, the one-month precipitation correlation decreases from *r* = 0.424 to *r* = 0.371. The relationship remains positive and statistically significant (*p* = 0.002).
This indicates that October 2023 strengthens the observed association but does not entirely account for it.

## Conclusions
The analysis identifies a positive association between previous-month precipitation anomalies and current NDVI anomalies, particularly during summer and autumn. Soil moisture is also positively associated with NDVI anomalies, with significant seasonal relationships in spring and summer.
Temperature shows a weaker and less consistent relationship with NDVI, although its contemporaneous association is statistically significant in the overall analysis.
The sensitivity analysis indicates that the precipitation–NDVI relationship remains positive after excluding October 2023, suggesting that the result is not solely driven by this observation.
These findings are exploratory. Correlation does not establish causation, and the results do not independently demonstrate drought impacts or identify their mechanisms. The study covers six years, seasonal sample sizes are relatively small, and multiple correlations are examined without adjustment for multiple testing. Further analysis with additional observations and complementary environmental variables would help assess the robustness of these patterns.

## Tools and Libraries
- Python
- Pandas
- Matplotlib
- Seaborn
- SciPy

## Repository Contents
- `Alghero_Nurra_Drought_Analysis.ipynb` — Jupyter Notebook containing the Python code, visualizations, and results of the data analysis.
- `data/Alghero_Nurra_Monthly_NDVI_2020_2025.csv` — monthly NDVI data exported from Google Earth Engine.
- `data/Alghero_Nurra_Monthly_Climate_2020_2025.csv` — monthly climate data exported from Google Earth Engine.
- `gee/Alghero_Nurra_Data_Extraction.js` — Google Earth Engine JavaScript script used to extract satellite and climate data for the study area.

## Repository Structure
```text
alghero-nurra-drought-analysis/
│
├── README.md
├── Alghero_Nurra_Drought_Analysis.ipynb
│
├── data/
│   ├── Alghero_Nurra_Monthly_NDVI_2020_2025.csv
│   └── Alghero_Nurra_Monthly_Climate_2020_2025.csv
│
└── gee/
    └── Alghero_Nurra_Data_Extraction.js
```

- **`Alghero_Nurra_Drought_Analysis.ipynb`** is a Jupyter Notebook containing the Python code, visualizations, and results of the data analysis, including anomaly calculation, contemporaneous and lagged correlation analysis, seasonal comparisons, and sensitivity analysis.
- **`data/`** contains the monthly NDVI and climate datasets exported from Google Earth Engine.
- **`gee/`** contains the Google Earth Engine JavaScript script used to extract satellite and climate data for the study area.
- **`README.md`** documents the project, datasets, methodology, main results, and conclusions.

## How to Run
1. Clone or download the repository.
2. Ensure both CSV files are located in the `data/` directory.
3. Install the required Python libraries:
   ```bash
   pip install pandas matplotlib seaborn scipy jupyter
   ```
4. Open `Alghero_Nurra_Drought_Analysis.ipynb` in Jupyter Notebook or JupyterLab.
5. Run the notebook cells in order.