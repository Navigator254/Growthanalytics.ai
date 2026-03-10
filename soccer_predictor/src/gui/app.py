"""
Football Predictions GUI - Linux Optimized
Complete Version with Main Function
"""
import tkinter as tk
from tkinter import ttk, messagebox, scrolledtext
from datetime import datetime, timedelta
import sys
import os
import logging
import json

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Add src to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

try:
    from config import settings
    COLORS = settings.COLORS
    WINDOW_SIZE = settings.WINDOW_SIZE
    WINDOW_TITLE = settings.WINDOW_TITLE
except ImportError:
    # Default settings if config not found
    COLORS = {
        'bg': '#f0f0f0',
        'header': '#2c3e50',
        'accent': '#3498db',
        'success': '#27ae60',
        'warning': '#f39c12',
        'danger': '#e74c3c',
        'light': '#ecf0f1',
        'dark': '#34495e'
    }
    WINDOW_SIZE = "1300x750"
    WINDOW_TITLE = "Football Predictions with Safe Bets & Arbitrage"

# Import API functions
try:
    from src.api.sportsmonks import (
        get_fixtures_by_date,
        get_fixtures_with_odds,
        calculate_edge_for_fixtures,
        find_arbitrage_opportunities,
        test_api_connection,
        get_todays_fixtures,
        get_tomorrows_fixtures,
        get_live_fixtures,
        get_upcoming_fixtures,
        get_popular_leagues,
        filter_safe_bets_only,
        get_league_info
    )
    logger.info("Successfully imported all API functions")
except ImportError as e:
    logger.error(f"Import error: {e}")
    # Create dummy functions to prevent crash
    def dummy_function(*args, **kwargs):
        messagebox.showerror("Module Error", "API module failed to load")
        return []
    
    # Assign dummy functions
    get_fixtures_by_date = dummy_function
    get_fixtures_with_odds = dummy_function
    calculate_edge_for_fixtures = dummy_function
    find_arbitrage_opportunities = dummy_function
    test_api_connection = lambda: False
    get_todays_fixtures = dummy_function
    get_tomorrows_fixtures = dummy_function
    get_live_fixtures = dummy_function
    get_upcoming_fixtures = dummy_function
    get_popular_leagues = lambda: []
    filter_safe_bets_only = lambda x: x
    get_league_info = lambda x: {"name": "Unknown"}

class SoccerApp:
    def __init__(self, root):
        self.root = root
        self.root.title(WINDOW_TITLE)
        self.root.geometry(WINDOW_SIZE)
        self.root.configure(bg=COLORS['bg'])
        
        # Current settings
        self.current_league_id = 5  # Default: Europa League
        self.current_date = datetime.now().strftime("%Y-%m-%d")
        self.current_predictions = []
        self.current_arbitrage = []
        
        # Setup styles
        self.setup_styles()
        
        # Build UI
        self.setup_ui()
        
        # Initialize
        self.initialize_app()
    
    def set_window_icon(self):
        """Set window icon if available"""
        icon_paths = [
            os.path.expanduser("~/soccer_predictor/football_icon.png"),
            "/usr/share/icons/football.png",
            os.path.join(os.path.dirname(__file__), "football_icon.png")
        ]
        
        for path in icon_paths:
            if os.path.exists(path):
                try:
                    self.root.iconphoto(True, tk.PhotoImage(file=path))
                    logger.info(f"Set window icon: {path}")
                    break
                except:
                    pass
    
    def setup_styles(self):
        """Configure ttk styles for Linux"""
        style = ttk.Style()
        
        # Try to use native theme
        available_themes = style.theme_names()
        logger.info(f"Available themes: {available_themes}")
        
        # Prefer modern themes
        preferred = ['clam', 'alt', 'default']
        for theme in preferred:
            if theme in available_themes:
                style.theme_use(theme)
                logger.info(f"Using theme: {theme}")
                break
        
        # Configure custom styles
        style.configure('Header.TLabel',
                      background=COLORS['header'],
                      foreground='white',
                      font=('DejaVu Sans', 14, 'bold'),
                      padding=10)
        
        style.configure('Accent.TButton',
                      background=COLORS['accent'],
                      foreground='white',
                      font=('DejaVu Sans', 10, 'bold'),
                      padding=6)
        
        style.configure('Success.TButton',
                      background=COLORS['success'],
                      foreground='white',
                      font=('DejaVu Sans', 10, 'bold'),
                      padding=6)
        
        style.configure('Warning.TButton',
                      background=COLORS['warning'],
                      foreground='white',
                      font=('DejaVu Sans', 10, 'bold'),
                      padding=6)
        
        style.configure('Title.TLabel',
                      font=('DejaVu Sans', 12, 'bold'),
                      foreground=COLORS['dark'])
        
        style.configure('Status.TLabel',
                      font=('DejaVu Sans', 9),
                      foreground=COLORS['dark'])
    
    def initialize_app(self):
        """Initialize the application"""
        self.status_message("Initializing application...")
        
        # Test API connection in background
        self.root.after(100, self.check_api_connection)
        
        # Load initial data
        self.root.after(500, self.load_initial_data)
    
    def check_api_connection(self):
        """Check API connection"""
        try:
            if test_api_connection():
                self.status_message("✅ Connected to SportsMonks API")
                logger.info("API connection successful")
            else:
                self.status_message("⚠️ Using simulated data mode")
                logger.warning("API connection failed, using simulation")
        except Exception as e:
            logger.error(f"API check error: {e}")
            self.status_message("⚠️ Error checking API connection")
    
    def load_initial_data(self):
        """Load initial data"""
        try:
            # Get today's fixtures
            self.refresh_fixtures()
        except Exception as e:
            logger.error(f"Error loading initial data: {e}")
    
    def setup_ui(self):
        """Setup the user interface"""
        # Main container
        main_container = ttk.Frame(self.root)
        main_container.pack(fill=tk.BOTH, expand=True, padx=5, pady=5)
        
        # ========== HEADER ==========
        header_frame = ttk.Frame(main_container, style='Header.TLabel')
        header_frame.pack(fill=tk.X, pady=(0, 10))
        
        header_label = ttk.Label(header_frame,
                                text="⚽ Football Predictions with Safe Bets & Arbitrage",
                                style='Header.TLabel')
        header_label.pack(pady=5)
        
        # ========== CONTROL PANEL ==========
        control_frame = ttk.Frame(main_container, relief=tk.RAISED, borderwidth=1)
        control_frame.pack(fill=tk.X, pady=(0, 10))
        
        # Top row
        top_row = ttk.Frame(control_frame)
        top_row.pack(fill=tk.X, padx=10, pady=10)
        
        # Date controls
        date_frame = ttk.Frame(top_row)
        date_frame.pack(side=tk.LEFT, padx=5)
        
        ttk.Label(date_frame, text="Date:").pack(side=tk.LEFT, padx=2)
        self.date_entry = ttk.Entry(date_frame, width=12)
        self.date_entry.insert(0, self.current_date)
        self.date_entry.pack(side=tk.LEFT, padx=2)
        
        # League selector
        league_frame = ttk.Frame(top_row)
        league_frame.pack(side=tk.LEFT, padx=20)
        
        ttk.Label(league_frame, text="League:").pack(side=tk.LEFT, padx=2)
        self.league_combo = ttk.Combobox(league_frame, width=20, state="readonly")
        self.league_combo.pack(side=tk.LEFT, padx=2)
        
        # Load leagues
        self.load_leagues()
        
        # Refresh button
        self.refresh_btn = ttk.Button(top_row, 
                                     text="🔍 Refresh Predictions", 
                                     command=self.refresh_fixtures,
                                     style='Accent.TButton')
        self.refresh_btn.pack(side=tk.RIGHT, padx=5)
        
        # Button row
        button_row = ttk.Frame(control_frame)
        button_row.pack(fill=tk.X, padx=10, pady=(0, 10))
        
        # Action buttons
        ttk.Button(button_row, 
                  text="📅 Today's Fixtures", 
                  command=self.load_today,
                  style='Accent.TButton').pack(side=tk.LEFT, padx=5)
        
        ttk.Button(button_row, 
                  text="📅 Tomorrow's Fixtures", 
                  command=self.load_tomorrow,
                  style='Accent.TButton').pack(side=tk.LEFT, padx=5)
        
        ttk.Button(button_row, 
                  text="⚡ Live Matches", 
                  command=self.load_live,
                  style='Warning.TButton').pack(side=tk.LEFT, padx=5)
        
        ttk.Button(button_row, 
                  text="💰 Find Arbitrage", 
                  command=self.find_arbitrage,
                  style='Success.TButton').pack(side=tk.LEFT, padx=5)
        
        ttk.Button(button_row, 
                  text="✅ Safe Bets Only", 
                  command=self.show_safe_bets,
                  style='Success.TButton').pack(side=tk.LEFT, padx=5)
        
        ttk.Button(button_row, 
                  text="💾 Export JSON", 
                  command=self.export_data,
                  style='Accent.TButton').pack(side=tk.LEFT, padx=5)
        
        # ========== MAIN CONTENT ==========
        content_frame = ttk.Frame(main_container)
        content_frame.pack(fill=tk.BOTH, expand=True)
        
        # Left panel - Predictions
        left_frame = ttk.LabelFrame(content_frame, text="📊 Match Predictions", padding=10)
        left_frame.pack(side=tk.LEFT, fill=tk.BOTH, expand=True, padx=(0, 5))
        
        # Create predictions treeview
        self.setup_predictions_treeview(left_frame)
        
        # Right panel - Arbitrage
        right_frame = ttk.LabelFrame(content_frame, text="💰 Arbitrage Opportunities", padding=10)
        right_frame.pack(side=tk.RIGHT, fill=tk.BOTH, expand=True, padx=(5, 0))
        
        # Create arbitrage treeview
        self.setup_arbitrage_treeview(right_frame)
        
        # ========== STATUS BAR ==========
        status_frame = ttk.Frame(main_container, relief=tk.SUNKEN, borderwidth=1)
        status_frame.pack(fill=tk.X, pady=(10, 0))
        
        self.status_label = ttk.Label(status_frame, 
                                     text="Ready", 
                                     style='Status.TLabel',
                                     anchor=tk.W)
        self.status_label.pack(side=tk.LEFT, padx=10, pady=5, fill=tk.X, expand=True)
        
        # Count labels
        self.predictions_count = ttk.Label(status_frame, 
                                          text="Predictions: 0", 
                                          style='Status.TLabel')
        self.predictions_count.pack(side=tk.RIGHT, padx=10, pady=5)
        
        self.arbitrage_count = ttk.Label(status_frame, 
                                        text="Arbitrage: 0", 
                                        style='Status.TLabel')
        self.arbitrage_count.pack(side=tk.RIGHT, padx=10, pady=5)
    
    def load_leagues(self):
        """Load leagues into combobox"""
        try:
            leagues = get_popular_leagues()
            league_names = [f"{league['name']} (ID: {league['id']})" for league in leagues]
            league_ids = [league['id'] for league in leagues]
            
            self.league_combo['values'] = league_names
            self.league_combo.current(1)  # Europa League by default
            
            # Store mapping
            self.league_mapping = dict(zip(league_names, league_ids))
            
        except Exception as e:
            logger.error(f"Error loading leagues: {e}")
            self.league_combo['values'] = ["Europa League (ID: 5)"]
            self.league_mapping = {"Europa League (ID: 5)": 5}
    
    def get_selected_league_id(self):
        """Get selected league ID from combobox"""
        try:
            selected = self.league_combo.get()
            return self.league_mapping.get(selected, 5)
        except:
            return 5
    
    def setup_predictions_treeview(self, parent):
        """Setup predictions treeview"""
        # Create frame for treeview and scrollbar
        tree_frame = ttk.Frame(parent)
        tree_frame.pack(fill=tk.BOTH, expand=True)
        
        # Create scrollbar
        scrollbar = ttk.Scrollbar(tree_frame)
        scrollbar.pack(side=tk.RIGHT, fill=tk.Y)
        
        # Create treeview
        self.predictions_tree = ttk.Treeview(tree_frame,
                                           yscrollcommand=scrollbar.set,
                                           selectmode='browse',
                                           height=15)
        
        # Configure columns
        self.predictions_tree['columns'] = ('match', 'league', 'expected', 'poisson', 'elo', 'ml', 'edge', 'confidence', 'safe_bet')
        
        # Format columns
        self.predictions_tree.column('#0', width=0, stretch=tk.NO)
        self.predictions_tree.column('match', width=180, minwidth=150)
        self.predictions_tree.column('league', width=100, minwidth=80)
        self.predictions_tree.column('expected', width=80, minwidth=70)
        self.predictions_tree.column('poisson', width=120, minwidth=100)
        self.predictions_tree.column('elo', width=120, minwidth=100)
        self.predictions_tree.column('ml', width=120, minwidth=100)
        self.predictions_tree.column('edge', width=60, minwidth=50)
        self.predictions_tree.column('confidence', width=80, minwidth=70)
        self.predictions_tree.column('safe_bet', width=80, minwidth=70)
        
        # Create headings
        self.predictions_tree.heading('match', text='Match')
        self.predictions_tree.heading('league', text='League')
        self.predictions_tree.heading('expected', text='Expected')
        self.predictions_tree.heading('poisson', text='Poisson %')
        self.predictions_tree.heading('elo', text='Elo %')
        self.predictions_tree.heading('ml', text='ML %')
        self.predictions_tree.heading('edge', text='Edge %')
        self.predictions_tree.heading('confidence', text='Confidence')
        self.predictions_tree.heading('safe_bet', text='Safe Bet')
        
        # Pack treeview
        self.predictions_tree.pack(side=tk.LEFT, fill=tk.BOTH, expand=True)
        scrollbar.config(command=self.predictions_tree.yview)
        
        # Add double-click event
        self.predictions_tree.bind('<Double-1>', self.on_prediction_double_click)
    
    def setup_arbitrage_treeview(self, parent):
        """Setup arbitrage treeview"""
        # Create frame for treeview and scrollbar
        tree_frame = ttk.Frame(parent)
        tree_frame.pack(fill=tk.BOTH, expand=True)
        
        # Create scrollbar
        scrollbar = ttk.Scrollbar(tree_frame)
        scrollbar.pack(side=tk.RIGHT, fill=tk.Y)
        
        # Create treeview
        self.arbitrage_tree = ttk.Treeview(tree_frame,
                                          yscrollcommand=scrollbar.set,
                                          selectmode='browse',
                                          height=15)
        
        # Configure columns
        self.arbitrage_tree['columns'] = ('match', 'profit', 'profit_amount', 'bookmakers', 'risk_level')
        
        # Format columns
        self.arbitrage_tree.column('#0', width=0, stretch=tk.NO)
        self.arbitrage_tree.column('match', width=180, minwidth=150)
        self.arbitrage_tree.column('profit', width=80, minwidth=70)
        self.arbitrage_tree.column('profit_amount', width=100, minwidth=90)
        self.arbitrage_tree.column('bookmakers', width=200, minwidth=180)
        self.arbitrage_tree.column('risk_level', width=80, minwidth=70)
        
        # Create headings
        self.arbitrage_tree.heading('match', text='Match')
        self.arbitrage_tree.heading('profit', text='Profit %')
        self.arbitrage_tree.heading('profit_amount', text='Profit (KSh)')
        self.arbitrage_tree.heading('bookmakers', text='Bookmakers')
        self.arbitrage_tree.heading('risk_level', text='Risk Level')
        
        # Pack treeview
        self.arbitrage_tree.pack(side=tk.LEFT, fill=tk.BOTH, expand=True)
        scrollbar.config(command=self.arbitrage_tree.yview)
        
        # Add double-click event
        self.arbitrage_tree.bind('<Double-1>', self.on_arbitrage_double_click)
    
    def refresh_fixtures(self):
        """Refresh fixtures and predictions"""
        try:
            # Get date and league
            date_str = self.date_entry.get()
            league_id = self.get_selected_league_id()
            
            self.status_message(f"Loading fixtures for {date_str}...")
            
            # Get fixtures
            fixtures = get_fixtures_by_date(date_str, league_id)
            
            if not fixtures:
                messagebox.showinfo("No Fixtures", f"No fixtures found for {date_str}")
                self.status_message("No fixtures found")
                return
            
            # Calculate predictions
            predictions = calculate_edge_for_fixtures(fixtures)
            
            # Update predictions treeview
            self.update_predictions_treeview(predictions)
            
            # Store current predictions
            self.current_predictions = predictions
            
            # Update status
            self.status_message(f"Loaded {len(predictions)} predictions for {date_str}")
            self.predictions_count.config(text=f"Predictions: {len(predictions)}")
            
        except Exception as e:
            logger.error(f"Error refreshing fixtures: {e}")
            self.status_message(f"Error: {str(e)}")
            messagebox.showerror("Error", f"Failed to load fixtures: {str(e)}")
    
    def update_predictions_treeview(self, predictions):
        """Update predictions treeview with data"""
        # Clear existing items
        for item in self.predictions_tree.get_children():
            self.predictions_tree.delete(item)
        
        # Add new items
        for pred in predictions:
            # Color code safe bets
            tags = ()
            if pred.get('safe_bet') == '✓ Value':
                tags = ('safe',)
            
            self.predictions_tree.insert('', 'end', 
                                        values=(pred['match'],
                                               pred['league'],
                                               pred['expected'],
                                               pred['poisson'],
                                               pred['elo'],
                                               pred['ml'],
                                               pred['edge'],
                                               pred['confidence'],
                                               pred['safe_bet']),
                                        tags=tags)
        
        # Configure tag colors
        self.predictions_tree.tag_configure('safe', background='#d4edda')
    
    def find_arbitrage(self):
        """Find arbitrage opportunities"""
        try:
            self.status_message("Searching for arbitrage opportunities...")
            
            # Get current date and league
            date_str = self.date_entry.get()
            league_id = self.get_selected_league_id()
            
            # Find arbitrage opportunities
            opportunities = find_arbitrage_opportunities(date_str, league_id)
            
            # Update arbitrage treeview
            self.update_arbitrage_treeview(opportunities)
            
            # Store current arbitrage
            self.current_arbitrage = opportunities
            
            # Update status
            self.status_message(f"Found {len(opportunities)} arbitrage opportunities")
            self.arbitrage_count.config(text=f"Arbitrage: {len(opportunities)}")
            
        except Exception as e:
            logger.error(f"Error finding arbitrage: {e}")
            self.status_message(f"Error: {str(e)}")
            messagebox.showerror("Error", f"Failed to find arbitrage: {str(e)}")
    
    def update_arbitrage_treeview(self, opportunities):
        """Update arbitrage treeview with data"""
        # Clear existing items
        for item in self.arbitrage_tree.get_children():
            self.arbitrage_tree.delete(item)
        
        # Add new items
        for opp in opportunities:
            # Format bookmakers string
            bookmakers_str = f"H: {opp['bookmakers']['home']}, D: {opp['bookmakers']['draw']}, A: {opp['bookmakers']['away']}"
            
            # Color code by risk level
            tags = ()
            if opp['risk_level'] == 'Low':
                tags = ('low_risk',)
            elif opp['risk_level'] == 'Medium':
                tags = ('medium_risk',)
            elif opp['risk_level'] == 'High':
                tags = ('high_risk',)
            
            self.arbitrage_tree.insert('', 'end',
                                      values=(opp['match'],
                                             opp['profit'],
                                             opp['profit_amount'],
                                             bookmakers_str,
                                             opp['risk_level']),
                                      tags=tags)
        
        # Configure tag colors
        self.arbitrage_tree.tag_configure('low_risk', background='#d4edda')
        self.arbitrage_tree.tag_configure('medium_risk', background='#fff3cd')
        self.arbitrage_tree.tag_configure('high_risk', background='#f8d7da')
    
    def load_today(self):
        """Load today's fixtures"""
        self.date_entry.delete(0, tk.END)
        self.date_entry.insert(0, datetime.now().strftime("%Y-%m-%d"))
        self.refresh_fixtures()
    
    def load_tomorrow(self):
        """Load tomorrow's fixtures"""
        tomorrow = (datetime.now() + timedelta(days=1)).strftime("%Y-%m-%d")
        self.date_entry.delete(0, tk.END)
        self.date_entry.insert(0, tomorrow)
        self.refresh_fixtures()
    
    def load_live(self):
        """Load live fixtures"""
        try:
            self.status_message("Loading live matches...")
            
            league_id = self.get_selected_league_id()
            live_fixtures = get_live_fixtures(league_id)
            
            if not live_fixtures:
                messagebox.showinfo("No Live Matches", "No live matches found")
                self.status_message("No live matches found")
                return
            
            # Calculate predictions for live matches
            predictions = calculate_edge_for_fixtures(live_fixtures)
            
            # Update treeview
            self.update_predictions_treeview(predictions)
            self.current_predictions = predictions
            
            self.status_message(f"Loaded {len(predictions)} live matches")
            self.predictions_count.config(text=f"Predictions: {len(predictions)}")
            
        except Exception as e:
            logger.error(f"Error loading live matches: {e}")
            self.status_message(f"Error: {str(e)}")
    
    def show_safe_bets(self):
        """Show only safe bets"""
        if not self.current_predictions:
            messagebox.showinfo("No Data", "Please load predictions first")
            return
        
        safe_bets = filter_safe_bets_only(self.current_predictions)
        
        if not safe_bets:
            messagebox.showinfo("No Safe Bets", "No safe bets found in current predictions")
            return
        
        self.update_predictions_treeview(safe_bets)
        self.status_message(f"Showing {len(safe_bets)} safe bets")
        self.predictions_count.config(text=f"Predictions: {len(safe_bets)}")
    
    def export_data(self):
        """Export data to JSON file"""
        try:
            # Create data dictionary
            export_data = {
                'timestamp': datetime.now().isoformat(),
                'date': self.date_entry.get(),
                'league_id': self.get_selected_league_id(),
                'predictions': self.current_predictions,
                'arbitrage_opportunities': self.current_arbitrage
            }
            
            # Save to file
            filename = f"soccer_predictions_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
            
            with open(filename, 'w') as f:
                json.dump(export_data, f, indent=2)
            
            self.status_message(f"Data exported to {filename}")
            messagebox.showinfo("Export Successful", f"Data exported to:\n{filename}")
            
        except Exception as e:
            logger.error(f"Error exporting data: {e}")
            messagebox.showerror("Export Error", f"Failed to export data: {str(e)}")
    
    def on_prediction_double_click(self, event):
        """Handle double-click on prediction row"""
        try:
            item = self.predictions_tree.selection()[0]
            values = self.predictions_tree.item(item, 'values')
            
            # Show detailed view
            detail_text = f"""Match: {values[0]}
League: {values[1]}
Expected Score: {values[2]}

Probabilities:
{values[3]}
{values[4]}
{values[5]}

Edge: {values[6]}
Confidence: {values[7]}
Safe Bet: {values[8]}"""
            
            messagebox.showinfo("Prediction Details", detail_text)
        except IndexError:
            pass  # No item selected
    
    def on_arbitrage_double_click(self, event):
        """Handle double-click on arbitrage row"""
        try:
            item = self.arbitrage_tree.selection()[0]
            values = self.arbitrage_tree.item(item, 'values')
            
            # Find the full opportunity data
            match_name = values[0]
            opportunity = next((opp for opp in self.current_arbitrage if opp['match'] == match_name), None)
            
            if opportunity:
                detail_text = f"""Match: {opportunity['match']}
Profit: {opportunity['profit']}
Profit Amount: {opportunity['profit_amount']}

Bookmakers:
Home: {opportunity['bookmakers']['home']}
Draw: {opportunity['bookmakers']['draw']}
Away: {opportunity['bookmakers']['away']}

Odds:
Home: {opportunity['odds']['home']}
Draw: {opportunity['odds']['draw']}
Away: {opportunity['odds']['away']}

Stakes (KSh {opportunity['stakes']['total']}):
Home: {opportunity['stakes']['home']}
Draw: {opportunity['stakes']['draw']}
Away: {opportunity['stakes']['away']}

Risk Level: {opportunity['risk_level']}
Timestamp: {opportunity['timestamp']}"""
                
                messagebox.showinfo("Arbitrage Details", detail_text)
        except IndexError:
            pass  # No item selected
    
    def status_message(self, message):
        """Update status message"""
        self.status_label.config(text=message)
        logger.info(message)


def main():
    """Main entry point"""
    root = tk.Tk()
    app = SoccerApp(root)
    root.mainloop()


if __name__ == "__main__":
    main()