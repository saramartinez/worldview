/*
 * NASA Worldview
 * 
 * This code was originally developed at NASA/Goddard Space Flight Center for
 * the Earth Science Data and Information System (ESDIS) project. 
 *
 * Copyright (C) 2013 United States Government as represented by the 
 * Administrator of the National Aeronautics and Space Administration.
 * All Rights Reserved.
 */
 
/**
 * Namespace: Worldview.Map
 * Worldview specific code when using OpenLayers.
 */
Worldview.namespace("Map");

$(function(ns) {
    
    var logPosition = Logging.getLogger("Worldview.Map.Position");
    
    /**
     * Constant: COORDINATE_CONTROLS
     * An object that contains OpenLayers.Contorl.MousePosition objects
     * that update the current latitude/longitude values on the map as the
     * mouse moves. Keyed by projection name, either "geographic", "arctic",
     * or "antarctic".
     * 
     * Example:
     * (begin code)
     * var contorl = Worldview.Map.COORDINATE_CONTROLS["geographic"];
     * (end code)
     */
    ns.COORDINATE_CONTROLS = {
        "geographic": new OpenLayers.Control.MousePosition({
            formatOutput: function(mouseLonLat) { 
                if ( logPosition.isDebugEnabled() ) {
                    logPosition.debug(mouseLonLat.lon.toFixed(3) + "," + 
                                      mouseLonLat.lat.toFixed(3));    
                }                          
                return mouseLonLat.lon.toFixed(3) + "&#176;, " + 
                       mouseLonLat.lat.toFixed(3) + "&#176;";
            }  
        }),
        "arctic": new OpenLayers.Control.MousePosition({
            projection: "EPSG:3413",
            formatOutput: function(mouseLonLat) { 
                if ( logPosition.isDebugEnabled() ) {
                    logPosition.debug(Math.round(mouseLonLat.lon) + "," + 
                                      Math.round(mouseLonLat.lat));  
                }                          
                return this.projection + " " +  
                        Math.round(mouseLonLat.lon) + "m, " + 
                        Math.round(mouseLonLat.lat) + "m";          
            }
        }),
        "antarctic": new OpenLayers.Control.MousePosition({
            formatOutput: function(mouseLonLat) {           
                if ( logPosition.isDebugEnabled() ) {
                    logPosition.debug(Math.round(mouseLonLat.lon) + "," + 
                                      Math.round(mouseLonLat.lat));  
                }                           
                return "EPSG:3031 " + 
                        Math.round(mouseLonLat.lon) + "m, " + 
                        Math.round(mouseLonLat.lat) + "m";                  
            },
        })
    };
    
    /**
     * Function: isExtentValid
     * Determines if an exent object contains valid values.
     * 
     * Parameters:
     * extent - An OpenLayers.Bound ojbect
     * 
     * Returns:
     * False if any of the values is NaN, otherwise returns true.
     */
    ns.isExtentValid = function(extent) {
        if ( extent === undefined ) {
            return false;
        }
        var valid = true;
        $.each(extent.toArray(), function(index, value) {
            if ( isNaN(value) ) {
                valid = false;
            }    
        });
        return valid;
    };
    
    /**
     * Property: tileScheduler
     * Scheduler used to render canvas tiles. Must be initialized on startup.
     */
    ns.tileScheduler = null;

    /**
     * Function: setOpacity
     * Sets the opacity of a layer. Since the backbuffer can interfere with
     * tile layers that have transparency, the transition effect is set to 
     * none if the opacity is not equal to one.
     * 
     * Parameters:
     * layer - An OpenLayers.Layer object to set the opacity
     * opacity - A value from 0 (transparent) to 1 (opaque).
     */
    ns.setOpacity = function(layer, opacity) { 
        layer.setOpacity(opacity);
        if ( opacity === 1 ) {
            var effect = layer.originalTransitionEffect || "resize";
            layer.transitionEffect = effect; 
        } else {
            layer.originalTransitionEffect = layer.transitionEffect;
            layer.transitionEffect = "none";
        }           
    }
    
    ns.setVisibility = function(layer, visible, opacity) {
        var actualOpacity = ( visible ) ? opacity : 0;
        layer.div.style.opacity = actualOpacity;    
    }
    
}(Worldview.Map));
