/************************************************************
 Alghero-Nurra Drought Analysis
 Google Earth Engine: data preparation and export only
 Study period: 2020-2025
************************************************************/

// 1. Study area and period
var geometry = ee.Geometry.Polygon([
  [
    [8.213954504027464, 40.66924395608461],
    [8.200221593871214, 40.636945930113214],
    [8.364329870238402, 40.57699691316944],
    [8.406901891722777, 40.62912954287395],
    [8.213954504027464, 40.66924395608461]
  ]
]);

var startDate = '2020-01-01';
var endDate = '2026-01-01';

print('Study area (km²):', geometry.area().divide(1e6));
Map.centerObject(geometry, 11);

// 2. Load and filter Sentinel-2
var sentinel2 = ee.ImageCollection('COPERNICUS/S2_SR_HARMONIZED')
  .filterBounds(geometry)
  .filterDate(startDate, endDate)
  .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 20));

// 3. Mask clouds and shadows, then calculate NDVI
function prepareNDVI(image) {
  var scl = image.select('SCL');

  var clearMask = scl.neq(3)
    .and(scl.neq(8))
    .and(scl.neq(9))
    .and(scl.neq(10))
    .and(scl.neq(11));

  var ndvi = image
    .updateMask(clearMask)
    .normalizedDifference(['B8', 'B4'])
    .rename('NDVI');

  return ndvi.copyProperties(image, ['system:time_start']);
}

var ndviCollection = sentinel2.map(prepareNDVI);

// 4. Create monthly median NDVI composites
var monthOffsets = ee.List.sequence(0, 71);

var monthlyNDVI = ee.ImageCollection.fromImages(
  monthOffsets.map(function(offset) {
    var start = ee.Date('2020-01-01').advance(offset, 'month');
    var end = start.advance(1, 'month');

    var monthlyImages = ndviCollection.filterDate(start, end);
    var composite = monthlyImages.median();

    return composite
      .set('system:time_start', start.millis())
      .set('date', start.format('YYYY-MM'))
      .set('year', start.get('year'))
      .set('month', start.get('month'));
  })
);

// 5. Extract monthly mean NDVI for the study area
var ndviTable = ee.FeatureCollection(
  monthlyNDVI.map(function(image) {

    var bandNames = image.bandNames();
    var hasBand = bandNames.contains('NDVI');

    var ndviValue = ee.Algorithms.If(
      hasBand,
      image.reduceRegion({
        reducer: ee.Reducer.mean(),
        geometry: geometry,
        scale: 30,
        maxPixels: 1e9,
        tileScale: 4
      }).get('NDVI'),
      null
    );

    return ee.Feature(null, {
      date: image.get('date'),
      year: image.get('year'),
      month: image.get('month'),
      NDVI_mean: ndviValue
    });
  })
);

print('Monthly NDVI table:', ndviTable.limit(10));
print('Number of monthly NDVI records:', ndviTable.size());

// 6. Load ERA5-Land monthly climate data
var climateBands = [
  'total_precipitation_sum',
  'temperature_2m',
  'volumetric_soil_water_layer_1'
];

var era5 = ee.ImageCollection('ECMWF/ERA5_LAND/MONTHLY_AGGR')
  .filterBounds(geometry)
  .filterDate(startDate, endDate)
  .select(climateBands);

// 7. Extract monthly mean climate variables
var climateTable = ee.FeatureCollection(
  era5.map(function(image) {
    var stats = image.reduceRegion({
      reducer: ee.Reducer.mean(),
      geometry: geometry,
      scale: 11132,
      maxPixels: 1e9,
      tileScale: 2
    });

    var date = ee.Date(image.get('system:time_start'));

    return ee.Feature(null, {
      date: date.format('YYYY-MM'),
      year: date.get('year'),
      month: date.get('month'),
      precipitation_mm: ee.Number(
        stats.get('total_precipitation_sum')
      ).multiply(1000),
      temperature_C: ee.Number(
        stats.get('temperature_2m')
      ).subtract(273.15),
      soil_moisture: stats.get(
        'volumetric_soil_water_layer_1'
      )
    });
  })
);

print('Monthly climate table:', climateTable.limit(5));
print('Number of monthly climate records:', climateTable.size());

// 8. Export the two tables as CSV files
Export.table.toDrive({
  collection: ndviTable,
  description: 'Alghero_Nurra_Monthly_NDVI_2020_2025',
  fileFormat: 'CSV',
  selectors: ['date', 'year', 'month', 'NDVI_mean']
});

Export.table.toDrive({
  collection: climateTable,
  description: 'Alghero_Nurra_Monthly_Climate_2020_2025',
  fileFormat: 'CSV',
  selectors: [
    'date',
    'year',
    'month',
    'precipitation_mm',
    'temperature_C',
    'soil_moisture'
  ]
});
