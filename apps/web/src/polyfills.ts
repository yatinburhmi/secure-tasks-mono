/**
 * Polyfills needed by Angular and TypeORM/class-transformer decorators.
 * Import this file in main.ts or include in angular.json polyfills array.
 */

// Needed for TypeORM/class-transformer decorators and Angular's DI if using advanced features.
import 'reflect-metadata';

// Zone JS is required by default for Angular itself.
import 'zone.js'; // Included via property in angular.json or project.json
