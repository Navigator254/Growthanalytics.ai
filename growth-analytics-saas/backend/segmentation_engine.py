# segmentation_engine.py
# Your Kaggle notebook code adapted for the API

import pandas as pd
import numpy as np
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.cluster import AgglomerativeClustering
import io
import warnings
warnings.filterwarnings('ignore')

class CustomerSegmentationEngine:
    def __init__(self):
        self.scaler = StandardScaler()
        self.model = None
        self.feature_names = None
        
    def process_upload(self, file_bytes, filename):
        """
        Main method to process uploaded file and return segmentation results
        This mirrors your Kaggle notebook workflow
        """
        
        # ============================================
        # 1. LOAD DATA (matches your notebook)
        # ============================================
        if filename.endswith('.csv'):
            df = pd.read_csv(io.BytesIO(file_bytes))
        else:
            df = pd.read_excel(io.BytesIO(file_bytes))
        
        # ============================================
        # 2. FEATURE ENGINEERING (your create_advanced_features)
        # ============================================
        df_fe = self.create_advanced_features(df)
        
        # ============================================
        # 3. CLEAN & PREPROCESS (your clean_and_preprocess)
        # ============================================
        df_clean = self.clean_and_preprocess(df_fe)
        
        # ============================================
        # 4. SELECT FEATURES (your select_clustering_features)
        # ============================================
        feature_cols, X = self.select_features(df_clean)
        self.feature_names = feature_cols
        
        # ============================================
        # 5. SCALE FEATURES (your StandardScaler)
        # ============================================
        X_scaled = self.scaler.fit_transform(X)
        
        # ============================================
        # 6. RUN CLUSTERING (your best model - Agglomerative)
        # ============================================
        # Based on your analysis, Agglomerative with 2 clusters was best
        self.model = AgglomerativeClustering(n_clusters=2, linkage='complete')
        labels = self.model.fit_predict(X_scaled)
        
        # ============================================
        # 7. GENERATE RESULTS (your analyze_segments)
        # ============================================
        results = self.generate_results(df_clean, labels, feature_cols)
        
        return results
    
    def create_advanced_features(self, df):
        """Your exact feature engineering code from Kaggle"""
        df_fe = df.copy()
        
        # 1. Total Children
        if 'Kidhome' in df_fe.columns and 'Teenhome' in df_fe.columns:
            df_fe['TotalChildren'] = df_fe['Kidhome'] + df_fe['Teenhome']
        
        # 2. Family Size
        if 'TotalChildren' in df_fe.columns:
            df_fe['FamilySize'] = df_fe['TotalChildren'] + 2
        
        # 3. Total Spending
        spending_cols = ['MntWines', 'MntFruits', 'MntMeatProducts', 
                         'MntFishProducts', 'MntSweetProducts', 'MntGoldProds']
        available_spending = [col for col in spending_cols if col in df_fe.columns]
        if available_spending:
            df_fe['TotalSpending'] = df_fe[available_spending].sum(axis=1)
        
        # 4. Average Spending
        if available_spending:
            df_fe['AvgSpending'] = df_fe[available_spending].mean(axis=1)
        
        # 5. Spending Diversity
        if available_spending:
            df_fe['SpendingDiversity'] = (df_fe[available_spending] > 0).sum(axis=1)
        
        # 6. Total Purchases
        purchase_cols = ['NumDealsPurchases', 'NumWebPurchases', 
                         'NumCatalogPurchases', 'NumStorePurchases', 'NumWebVisitsMonth']
        available_purchases = [col for col in purchase_cols if col in df_fe.columns]
        if available_purchases:
            df_fe['TotalPurchases'] = df_fe[available_purchases].sum(axis=1)
        
        # 7. Purchase Channel Preference
        if 'NumWebPurchases' in df_fe.columns and 'NumStorePurchases' in df_fe.columns:
            df_fe['WebVsStore'] = df_fe['NumWebPurchases'] - df_fe['NumStorePurchases']
        
        # 8. Income per Person
        if 'Income' in df_fe.columns and 'FamilySize' in df_fe.columns:
            df_fe['IncomePerPerson'] = df_fe['Income'] / df_fe['FamilySize']
        
        # 9. Spending to Income Ratio
        if 'TotalSpending' in df_fe.columns and 'Income' in df_fe.columns:
            df_fe['SpendingToIncome'] = df_fe['TotalSpending'] / (df_fe['Income'] + 1)
        
        return df_fe
    
    def clean_and_preprocess(self, df):
        """Your cleaning code from Kaggle"""
        df_clean = df.copy()
        
        # Handle missing Income
        if 'Income' in df_clean.columns:
            df_clean['Income'] = df_clean['Income'].fillna(df_clean['Income'].median())
        
        # Handle outliers for numerical columns
        numerical_cols = df_clean.select_dtypes(include=[np.number]).columns
        for col in numerical_cols:
            if df_clean[col].notna().sum() > 0:
                Q1 = df_clean[col].quantile(0.25)
                Q3 = df_clean[col].quantile(0.75)
                IQR = Q3 - Q1
                lower_bound = Q1 - 3 * IQR
                upper_bound = Q3 + 3 * IQR
                df_clean[col] = df_clean[col].clip(lower_bound, upper_bound)
        
        return df_clean
    
    def select_features(self, df):
        """Select features for clustering"""
        core_features = [
            'Income', 'TotalChildren', 'TotalSpending', 'TotalPurchases',
            'Recency', 'NumWebVisitsMonth', 'SpendingDiversity',
            'IncomePerPerson', 'SpendingToIncome'
        ]
        
        optional_features = [
            'AgeAtEnrollment', 'CustomerTenure', 'WebVsStore', 'FamilySize', 'AvgSpending'
        ]
        
        # Get available features
        available_features = [f for f in core_features if f in df.columns]
        for f in optional_features:
            if f in df.columns:
                available_features.append(f)
        
        # Prepare feature matrix
        X = df[available_features].copy()
        
        # Handle any remaining NaN values
        X = X.replace([np.inf, -np.inf], np.nan)
        for col in X.columns:
            if X[col].isna().any():
                X[col] = X[col].fillna(X[col].median())
        
        return available_features, X
    
    def generate_results(self, df, labels, features):
        """Generate insights from clusters"""
        df['Segment'] = labels
        
        # Segment profiles
        profiles = {}
        for segment in sorted(df['Segment'].unique()):
            segment_data = df[df['Segment'] == segment]
            profiles[f'Segment {segment}'] = {
                'size': int(len(segment_data)),
                'percentage': round(len(segment_data) / len(df) * 100, 1),
                'avg_income': round(segment_data['Income'].mean(), 2) if 'Income' in segment_data else 0,
                'avg_spending': round(segment_data['TotalSpending'].mean(), 2) if 'TotalSpending' in segment_data else 0,
                'avg_purchases': round(segment_data['TotalPurchases'].mean(), 1) if 'TotalPurchases' in segment_data else 0,
                'avg_recency': round(segment_data['Recency'].mean(), 1) if 'Recency' in segment_data else 0
            }
        
        # Determine segment names based on characteristics
        segment_names = self.name_segments(profiles)
        
        return {
            'total_customers': len(df),
            'segments_found': len(profiles),
            'segment_profiles': profiles,
            'segment_names': segment_names,
            'features_used': features
        }
    
    def name_segments(self, profiles):
        """Name segments based on characteristics"""
        names = {}
        for seg, data in profiles.items():
            if data['avg_income'] > 60000:
                income = "Premium"
            elif data['avg_income'] > 40000:
                income = "Mid-tier"
            else:
                income = "Value"
            
            if data['avg_spending'] > 1000:
                spend = "Big Spenders"
            elif data['avg_spending'] > 400:
                spend = "Regular Buyers"
            else:
                spend = "Occasional"
            
            names[seg] = f"{income} {spend}"
        return names